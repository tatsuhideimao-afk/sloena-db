import { useMemo, useState } from 'react';
import { Machine, EVPoint, Ceiling } from '../types/machine';

function interpolate(g: number, table: EVPoint[]): number {
  if (!table || table.length === 0) return 0;
  if (g <= table[0][0]) return table[0][1];
  if (g >= table[table.length - 1][0]) return table[table.length - 1][1];
  for (let i = 0; i < table.length - 1; i++) {
    if (g >= table[i][0] && g <= table[i + 1][0]) {
      const [g1, v1] = table[i];
      const [g2, v2] = table[i + 1];
      return Math.round(v1 + ((v2 - v1) * (g - g1)) / (g2 - g1));
    }
  }
  return 0;
}

function stepFor(max: number): number {
  return max <= 30 ? 1 : max <= 200 ? 5 : 10;
}

type Rate = 'equiv' | 'rate56';

export default function ExpectedValueCalculator({ machine }: { machine: Machine }) {
  const evTables = machine.evTables;

  // スライダーは「最大値>0の天井」ごとに1本生成する。
  // evTablesのキーは天井名の前方一致で対応付ける(例: 天井"GG間"→テーブル"GG")。
  // これにより _reset / _short 等の補助テーブル(対応天井なし)はUIから自動除外される。
  const sliderCeilings: Ceiling[] = useMemo(
    () => (machine.ceilings || []).filter((c) => c.max > 0),
    [machine.id]
  );

  const tableKeyFor = (c: Ceiling): string | undefined => {
    if (!evTables) return undefined;
    return Object.keys(evTables).find((k) => c.name.startsWith(k));
  };

  const corrections = machine.corrections;

  const initValues = useMemo(() => {
    const v: Record<string, number> = {};
    sliderCeilings.forEach((c) => {
      const isCz = c.name.includes('CZ');
      v[c.name] = isCz ? Math.min(150, c.max) : Math.min(Math.round(c.max * 0.4), c.max);
    });
    return v;
  }, [machine.id]);

  const [values, setValues] = useState<Record<string, number>>(initValues);
  const [rate, setRate] = useState<Rate>('equiv');
  const [slu, setSlu] = useState(0);
  const [opts, setOpts] = useState<Record<string, boolean>>({});

  const setVal = (key: string, v: number) => setValues((p) => ({ ...p, [key]: v }));

  const ev = useMemo(() => {
    const perSlider = sliderCeilings.map((c) => {
      const tableKey = tableKeyFor(c);
      const g = values[c.name] ?? 0;
      const evVal = tableKey ? interpolate(g, evTables![tableKey][rate]) : null;
      const isCz = c.name.includes('CZ');
      return { key: c.name, ceil: c, max: c.max, g, evVal, hasTable: !!tableKey, isCz, remain: c.max - g };
    });

    // 期待値合算は「テーブルを持つ天井」のみ対象(周期等の補助スライダーは除外)
    const withEv = perSlider.filter((c) => c.evVal !== null) as (typeof perSlider[number] & { evVal: number })[];
    const evVals = withEv.map((c) => c.evVal);
    const mainEv = evVals.length ? Math.max(...evVals) : 0;
    const subSum = evVals
      .filter((v) => v !== mainEv)
      .reduce((acc, v) => acc + Math.max(0, v) * 0.5, 0);
    let base = mainEv + subSum;

    const adjustments: string[] = withEv.map(
      (c) => `${c.ceil.name}期待値: ${c.evVal >= 0 ? '+' : ''}${c.evVal.toLocaleString()}円`
    );
    adjustments.push(`合算ベース(主+副×0.5): ${base >= 0 ? '+' : ''}${Math.round(base).toLocaleString()}円`);

    const sluBonus = corrections?.sluRule?.[String(slu)] ?? 0;
    if (sluBonus) {
      base += sluBonus;
      adjustments.push(`スルー${slu}回: +${sluBonus.toLocaleString()}円`);
    }

    const czSlider = withEv.find((c) => c.isCz);
    const cz = corrections?.czRanges;
    if (czSlider && cz) {
      if (cz.shallow && czSlider.g < cz.shallow.max) {
        base += cz.shallow.value;
        adjustments.push(`${cz.shallow.label}: ${cz.shallow.value >= 0 ? '+' : ''}${cz.shallow.value}円`);
      } else if (cz.deep && czSlider.g >= cz.deep.min) {
        base += cz.deep.value;
        adjustments.push(`${cz.deep.label}: ${cz.deep.value >= 0 ? '+' : ''}${cz.deep.value}円`);
      }
    }

    corrections?.options?.forEach((o) => {
      if (opts[o.id]) {
        base += o.value;
        adjustments.push(`${o.label}: +${o.value.toLocaleString()}円`);
      }
    });

    base = Math.round(base);

    // 必要投資・先到達天井はG換算可能(テーブルを持つ)天井のみで算出
    const coinSpeed = machine.spec?.coinSpeed ?? 31;
    const remains = withEv.map((c) => ({ c, er: c.isCz ? c.remain * 0.85 : c.remain }));
    const minRemain = remains.length ? Math.min(...remains.map((r) => r.er)) : 0;
    const inv = Math.round((minRemain / coinSpeed) * 1000);
    const whichFirst = remains.length
      ? remains.reduce((a, b) => (b.er < a.er ? b : a)).c
      : perSlider[0];

    return { base, adjustments, inv, perSlider, whichFirst, hasAnyEv: withEv.length > 0 };
  }, [values, rate, slu, opts, machine.id]);

  const evColor =
    ev.base > 1500
      ? 'text-emerald-400'
      : ev.base > 500
        ? 'text-emerald-300'
        : ev.base > 0
          ? 'text-yellow-300'
          : ev.base > -500
            ? 'text-orange-400'
            : 'text-red-500';
  const evJudge =
    ev.base > 2000
      ? '◎全ツッパ'
      : ev.base > 1000
        ? '○打つ'
        : ev.base > 300
          ? '△薄プラス'
          : ev.base > -300
            ? '×ボーダー'
            : '×見送り';

  if (!evTables || !ev.hasAnyEv) {
    return <div className="text-xs text-stone-500">期待値データ準備中</div>;
  }

  return (
    <div className="space-y-3">
      {/* 天井別スライダー */}
      {ev.perSlider.map((c) => {
        const step = stepFor(c.max);
        const marks = [1, 2, 3, 4, 5].map((n) => Math.round((c.max * n) / 6 / step) * step);
        return (
          <div key={c.key} className="bg-[#131c18] rounded p-3 border border-teal-900/30">
            <div className="flex justify-between items-baseline mb-1">
              <div className="text-xs text-stone-400">
                {c.ceil.name} ({c.ceil.unit})
                {!c.hasTable && <span className="text-stone-600 ml-1">※参考</span>}
              </div>
              <div className="text-white font-bold text-xl">{c.g}</div>
            </div>
            <input
              type="range"
              min={0}
              max={c.max}
              step={step}
              value={c.g}
              onChange={(e) => setVal(c.key, +e.target.value)}
              className="w-full"
            />
            <div className="grid grid-cols-5 gap-1 mt-2">
              {marks.map((v) => (
                <button
                  key={v}
                  onClick={() => setVal(c.key, v)}
                  className="text-xs py-1 bg-[#0c1410] rounded-sm border border-teal-900/30 text-stone-300"
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              残: <span className="text-stone-300 font-bold">{c.remain}</span> / 天井{c.max}
            </div>
          </div>
        );
      })}

      {/* 先到達天井 */}
      <div className="bg-amber-950/30 rounded p-2 border border-amber-800/50 text-center">
        <div className="text-xs text-stone-400">先に到達する天井</div>
        <div className="text-sm font-bold text-amber-400">
          {ev.whichFirst?.ceil.name} 残{ev.whichFirst?.remain}
        </div>
      </div>

      {/* 交換率 */}
      <div className="bg-[#131c18] rounded p-3 border border-teal-900/30">
        <div className="text-xs text-stone-400 mb-2">交換率</div>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setRate('equiv')}
            className={`py-2 text-sm rounded-sm border ${rate === 'equiv' ? 'bg-teal-900/60 border-teal-400 text-white' : 'bg-[#0c1410] border-teal-900/30 text-stone-300'}`}
          >
            等価
          </button>
          <button
            onClick={() => setRate('rate56')}
            className={`py-2 text-sm rounded-sm border ${rate === 'rate56' ? 'bg-teal-900/60 border-teal-400 text-white' : 'bg-[#0c1410] border-teal-900/30 text-stone-300'}`}
          >
            5.6枚
          </button>
        </div>
      </div>

      {/* スルー回数 */}
      {corrections?.sluRule && (
        <div className="bg-[#131c18] rounded p-3 border border-teal-900/30">
          <div className="text-xs text-stone-400 mb-2">スルー回数</div>
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setSlu(n)}
                className={`py-2 text-sm rounded-sm border ${slu === n ? 'bg-teal-900/60 border-teal-400 text-white' : 'bg-[#0c1410] border-teal-900/30 text-stone-300'}`}
              >
                {n}
                {n === 3 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* オプション補正 */}
      {corrections?.options && corrections.options.length > 0 && (
        <div className="bg-[#131c18] rounded p-3 border border-teal-900/30 space-y-2">
          {corrections.options.map((o) => (
            <label key={o.id} className="flex items-center gap-2 text-sm text-stone-200">
              <input
                type="checkbox"
                checked={!!opts[o.id]}
                onChange={(e) => setOpts((p) => ({ ...p, [o.id]: e.target.checked }))}
                className="w-4 h-4 accent-teal-400"
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* 期待値表示 */}
      <div className="bg-gradient-to-br from-teal-950/40 to-[#131c18] rounded p-4 border-2 border-teal-900/60">
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-xs text-stone-400">合算期待値</div>
          <div className={`text-sm font-bold ${evColor}`}>{evJudge}</div>
        </div>
        <div className={`text-3xl font-bold ${evColor}`} style={{ fontFamily: 'monospace' }}>
          {ev.base >= 0 ? '+' : ''}
          {ev.base.toLocaleString()}円
        </div>

        {/* 内訳 */}
        <div className="mt-3 pt-3 border-t border-teal-900/30">
          <div className="text-xs text-stone-400 mb-1">内訳</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {ev.perSlider.map((c) => (
              <div key={c.key} className="bg-[#0c1410]/50 rounded p-2 border border-teal-900/30">
                <div className="text-stone-500">{c.ceil.name}単独</div>
                {c.evVal === null ? (
                  <div className="font-mono font-bold text-stone-600">—</div>
                ) : (
                  <div className={`font-mono font-bold ${c.evVal >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
                    {c.evVal >= 0 ? '+' : ''}
                    {c.evVal.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-teal-900/30">
          <div className="text-xs text-stone-400 mb-1">計算詳細</div>
          <div className="text-xs text-stone-400 space-y-0.5">
            {ev.adjustments.map((a, i) => (
              <div key={i} className="font-mono">
                {a}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-teal-900/30 text-xs text-stone-400 space-y-1">
          <div className="flex justify-between">
            <span>先到達天井:</span> <span className="text-amber-400 font-bold">{ev.whichFirst?.ceil.name}</span>
          </div>
          <div className="flex justify-between">
            <span>必要投資目安:</span> <span className="text-white font-bold">約{ev.inv.toLocaleString()}円</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-stone-500 leading-relaxed bg-[#131c18]/50 p-2 rounded border border-teal-900/30">
        ※ 合算ロジック: 主導値(最も高い単独期待値) + 副値(その他)がプラスなら50%加算。「※参考」スライダーは期待値合算の対象外。
      </div>
    </div>
  );
}
