import { Mode } from '../types/machine';

export default function ModeTable({ modes }: { modes?: Mode[] }) {
  if (!modes || modes.length === 0) {
    return <div className="text-xs text-slate-500">モードデータ準備中</div>;
  }
  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 mb-2">モード×ゾーン×天井</div>
      {modes.map((m, i) => (
        <div key={i} className="bg-[#ffffff] rounded p-3 border border-slate-200">
          <div className="flex justify-between items-baseline">
            <div className="text-sm font-bold text-teal-600">{m.name}</div>
            <div className="text-xs text-slate-500">
              天井: <span className="text-slate-900 font-bold">{m.tenjo}</span>
            </div>
          </div>
          <div className="text-xs text-slate-600 mt-1">ゾーン: {m.zones}</div>
          <div className="text-xs text-slate-500 mt-1">{m.note}</div>
        </div>
      ))}
    </div>
  );
}
