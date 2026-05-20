import { Hint } from '../types/machine';

export default function HintsList({ hints }: { hints?: Hint[] }) {
  if (!hints || hints.length === 0) {
    return <div className="text-xs text-stone-500">招待状データ準備中</div>;
  }
  const sorted = [...hints].sort((a, b) => b.priority - a.priority);
  return (
    <div className="space-y-2">
      <div className="text-xs text-stone-400 mb-2">液晶ポイント50G毎(末尾00G除く)に出現</div>
      {sorted.map((inv, i) => (
        <div
          key={i}
          className={`rounded p-3 border ${
            inv.priority >= 4
              ? 'bg-emerald-950/30 border-emerald-800'
              : inv.priority >= 2
                ? 'bg-[#131c18] border-teal-900/40'
                : 'bg-[#131c18]/50 border-teal-900/20'
          }`}
        >
          <div className="flex justify-between items-baseline">
            <div className="text-sm text-white flex-1">「{inv.text}」</div>
            <div
              className={`text-xs ml-2 ${
                inv.priority >= 4 ? 'text-emerald-400' : inv.priority >= 2 ? 'text-yellow-400' : 'text-stone-500'
              }`}
            >
              {'★'.repeat(inv.priority)}
            </div>
          </div>
          <div className="text-xs text-stone-400 mt-1">[{inv.type}]</div>
          <div className="text-xs text-stone-300 mt-1">{inv.detail}</div>
        </div>
      ))}
    </div>
  );
}
