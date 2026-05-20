import { EndCard, EndCardSetting } from '../types/machine';

interface Props {
  endCards?: EndCard[];
  endCardsSetting?: EndCardSetting[];
}

export default function EndCardsList({ endCards, endCardsSetting }: Props) {
  if ((!endCards || endCards.length === 0) && (!endCardsSetting || endCardsSetting.length === 0)) {
    return <div className="text-xs text-stone-500">終了画面データ準備中</div>;
  }
  const sortedCards = endCards ? [...endCards].sort((a, b) => b.priority - a.priority) : [];
  return (
    <div className="space-y-4">
      {sortedCards.length > 0 && (
        <div>
          <div className="text-sm font-bold text-teal-400 mb-2">エンドカード(モード示唆)</div>
          <div className="space-y-1">
            {sortedCards.map((c, i) => (
              <div
                key={i}
                className={`rounded p-2 border ${
                  c.priority >= 4
                    ? 'bg-emerald-950/30 border-emerald-800'
                    : c.priority >= 3
                      ? 'bg-[#131c18] border-teal-900/40'
                      : 'bg-[#131c18]/50 border-teal-900/20'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <div className="text-sm text-white">{c.char}</div>
                  <div
                    className={`text-xs ${
                      c.priority >= 4 ? 'text-emerald-400' : c.priority >= 3 ? 'text-yellow-400' : 'text-stone-500'
                    }`}
                  >
                    {'★'.repeat(c.priority)}
                  </div>
                </div>
                <div className="text-xs text-stone-300 mt-1">{c.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {endCardsSetting && endCardsSetting.length > 0 && (
        <div>
          <div className="text-sm font-bold text-teal-400 mb-2">設定示唆(色別)</div>
          <div className="space-y-1">
            {endCardsSetting.map((c, i) => (
              <div key={i} className="bg-[#131c18] rounded p-2 border border-teal-900/30">
                <div className="text-xs font-bold text-stone-300">{c.color}</div>
                <div className="text-xs text-stone-400 mt-1">{c.chars}</div>
                <div className="text-xs text-yellow-300 mt-1">→ {c.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
