import { Mode } from '../types/machine';

export default function ModeTable({ modes }: { modes?: Mode[] }) {
  if (!modes || modes.length === 0) {
    return <div className="text-xs text-stone-500">モードデータ準備中</div>;
  }
  return (
    <div className="space-y-2">
      <div className="text-xs text-stone-400 mb-2">モード×ゾーン×天井</div>
      {modes.map((m, i) => (
        <div key={i} className="bg-[#131c18] rounded p-3 border border-teal-900/30">
          <div className="flex justify-between items-baseline">
            <div className="text-sm font-bold text-teal-400">{m.name}</div>
            <div className="text-xs text-stone-400">
              天井: <span className="text-white font-bold">{m.tenjo}</span>
            </div>
          </div>
          <div className="text-xs text-stone-300 mt-1">ゾーン: {m.zones}</div>
          <div className="text-xs text-stone-500 mt-1">{m.note}</div>
        </div>
      ))}
    </div>
  );
}
