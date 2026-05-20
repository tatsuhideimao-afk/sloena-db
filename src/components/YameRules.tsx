import { YameRule } from '../types/machine';

export default function YameRules({ rules }: { rules?: YameRule[] }) {
  if (!rules || rules.length === 0) {
    return <div className="text-xs text-stone-500">やめ時データ準備中</div>;
  }
  return (
    <div className="space-y-2">
      {rules.map((r, i) => (
        <div key={i} className="bg-[#131c18] rounded p-3 border border-teal-900/30">
          <div className="text-sm font-bold text-teal-400">{r.situation}</div>
          <div className="text-sm text-white mt-1">→ {r.action}</div>
          <div className="text-xs text-stone-400 mt-1">{r.reason}</div>
        </div>
      ))}
    </div>
  );
}
