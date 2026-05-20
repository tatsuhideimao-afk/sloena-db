import { EndCard, EndCardSetting } from '../types/machine';

interface Props {
  endCards?: EndCard[];
  endCardsSetting?: EndCardSetting[];
}

export default function EndCardsList({ endCards, endCardsSetting }: Props) {
  if ((!endCards || endCards.length === 0) && (!endCardsSetting || endCardsSetting.length === 0)) {
    return <div className="text-xs text-slate-500">終了画面データ準備中</div>;
  }
  const sortedCards = endCards ? [...endCards].sort((a, b) => b.priority - a.priority) : [];
  return (
    <div className="space-y-4">
      {sortedCards.length > 0 && (
        <div>
          <div className="text-sm font-bold text-teal-600 mb-2">エンドカード(モード示唆)</div>
          <div className="space-y-1">
            {sortedCards.map((c, i) => (
              <div
                key={i}
                className={`rounded p-2 border ${
                  c.priority >= 4
                    ? 'bg-emerald-50 border-emerald-300'
                    : c.priority >= 3
                      ? 'bg-[#ffffff] border-teal-300'
                      : 'bg-[#ffffff]/50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <div className="text-sm text-slate-900">{c.char}</div>
                  <div
                    className={`text-xs ${
                      c.priority >= 4 ? 'text-emerald-700' : c.priority >= 3 ? 'text-amber-600' : 'text-slate-500'
                    }`}
                  >
                    {'★'.repeat(c.priority)}
                  </div>
                </div>
                <div className="text-xs text-slate-600 mt-1">{c.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {endCardsSetting && endCardsSetting.length > 0 && (
        <div>
          <div className="text-sm font-bold text-teal-600 mb-2">設定示唆(色別)</div>
          <div className="space-y-1">
            {endCardsSetting.map((c, i) => (
              <div key={i} className="bg-[#ffffff] rounded p-2 border border-slate-200">
                <div className="text-xs font-bold text-slate-600">{c.color}</div>
                <div className="text-xs text-slate-500 mt-1">{c.chars}</div>
                <div className="text-xs text-amber-600 mt-1">→ {c.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
