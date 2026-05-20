import { Hint } from '../types/machine';

export default function HintsList({ hints }: { hints?: Hint[] }) {
  if (!hints || hints.length === 0) {
    return <div className="text-xs text-slate-500">招待状データ準備中</div>;
  }
  const sorted = [...hints].sort((a, b) => b.priority - a.priority);
  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 mb-2">液晶ポイント50G毎(末尾00G除く)に出現</div>
      {sorted.map((inv, i) => (
        <div
          key={i}
          className={`rounded p-3 border ${
            inv.priority >= 4
              ? 'bg-emerald-50 border-emerald-300'
              : inv.priority >= 2
                ? 'bg-[#ffffff] border-teal-300'
                : 'bg-[#ffffff]/50 border-slate-200'
          }`}
        >
          <div className="flex justify-between items-baseline">
            <div className="text-sm text-slate-900 flex-1">「{inv.text}」</div>
            <div
              className={`text-xs ml-2 ${
                inv.priority >= 4 ? 'text-emerald-700' : inv.priority >= 2 ? 'text-amber-600' : 'text-slate-500'
              }`}
            >
              {'★'.repeat(inv.priority)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1">[{inv.type}]</div>
          <div className="text-xs text-slate-600 mt-1">{inv.detail}</div>
        </div>
      ))}
    </div>
  );
}
