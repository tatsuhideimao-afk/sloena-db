import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sloena_tokyoghoul_shockpoint';

type Tier = { min: number; max: number; label: string; color: 'stone' | 'emerald' | 'red'; note: string };

const TIERS: Tier[] = [
  { min: 0, max: 8, label: 'ノーマル', color: 'stone', note: '通常評価' },
  { min: 9, max: 15, label: '解放期待大', color: 'emerald', note: 'スルー直後から狙える' },
  { min: 16, max: 999, label: '解放困難', color: 'red', note: '見送り推奨(初期振り分けハズレ濃厚)' },
];

const getTier = (point: number): Tier => TIERS.find((t) => point >= t.min && point <= t.max) ?? TIERS[0];

type EventType = 'cz' | 'at';

export default function ShockPointCounter() {
  const [czFail, setCzFail] = useState(0);
  const [atKakenuke, setAtKakenuke] = useState(0);
  const [history, setHistory] = useState<EventType[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { cz, at, hist } = JSON.parse(saved);
        setCzFail(cz || 0);
        setAtKakenuke(at || 0);
        setHistory(Array.isArray(hist) ? hist : []);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cz: czFail, at: atKakenuke, hist: history, updatedAt: new Date().toISOString() })
    );
  }, [czFail, atKakenuke, history]);

  const total = czFail + atKakenuke;
  const tier = getTier(total);
  const colorClass = {
    stone: 'bg-slate-100 border-slate-300 text-slate-700',
    emerald: 'bg-emerald-50 border-emerald-400 text-emerald-700',
    red: 'bg-red-50 border-red-400 text-red-700',
  }[tier.color];

  const handleAdd = (type: EventType) => {
    setHistory((h) => [...h, type]);
    if (type === 'cz') setCzFail((v) => v + 1);
    else setAtKakenuke((v) => v + 1);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last === 'cz') setCzFail((v) => Math.max(0, v - 1));
    else setAtKakenuke((v) => Math.max(0, v - 1));
    setHistory((h) => h.slice(0, -1));
  };

  const handleReset = (reason: string) => {
    if (!window.confirm(`${reason}でリセットします。よろしいですか?`)) return;
    setCzFail(0);
    setAtKakenuke(0);
    setHistory([]);
  };

  return (
    <div className="bg-[#ffffff] border border-slate-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-800 font-bold text-sm">喰ポイント実測カウンター</h3>
        <span className="text-xs text-slate-400">設定変更後カウント</span>
      </div>

      <div className={`${colorClass} border-2 rounded-lg p-3 text-center`}>
        <div className="text-3xl font-mono font-bold">
          {total}
          <span className="text-base ml-1">pt</span>
        </div>
        <div className="text-sm font-bold mt-1">{tier.label}</div>
        <div className="text-xs opacity-80">{tier.note}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="bg-[#eef4f1] rounded p-2 text-center">
          CZ失敗 <span className="text-slate-900 font-mono font-bold ml-1">{czFail}</span>
        </div>
        <div className="bg-[#eef4f1] rounded p-2 text-center">
          AT駆け抜け <span className="text-slate-900 font-mono font-bold ml-1">{atKakenuke}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleAdd('cz')}
          className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold py-3 rounded transition-colors"
        >
          + CZ失敗
        </button>
        <button
          onClick={() => handleAdd('at')}
          className="bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold py-3 rounded transition-colors"
        >
          + AT駆け抜け
        </button>
      </div>

      <div className="flex gap-2 text-xs">
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-slate-700 py-2 rounded"
        >
          ↶ 1つ戻す
        </button>
        <button
          onClick={() => handleReset('有利区間切れ')}
          className="flex-1 bg-amber-200 hover:bg-amber-300 text-amber-800 py-2 rounded"
        >
          有利区間切れ
        </button>
        <button
          onClick={() => handleReset('設定変更/台移動')}
          className="flex-1 bg-red-200 hover:bg-red-300 text-red-800 py-2 rounded"
        >
          全リセット
        </button>
      </div>

      <details className="text-xs text-slate-500">
        <summary className="cursor-pointer hover:text-slate-700">カウント定義 (タップで展開)</summary>
        <ul className="mt-2 space-y-1 pl-4 list-disc">
          <li>CZ失敗 = チャンスゾーン非当選で通常戻り</li>
          <li>AT駆け抜け = 1戦目グールバトル敗北で終了</li>
          <li className="text-emerald-700">石眼の袋(連チャン)経由は駆け抜けではない=カウントしない</li>
          <li className="text-emerald-700">バイツ(勝利)もカウントしない</li>
          <li className="text-amber-700">有利区間切れ(2400枚到達/アリマ成功)で必ずリセット</li>
        </ul>
      </details>
    </div>
  );
}
