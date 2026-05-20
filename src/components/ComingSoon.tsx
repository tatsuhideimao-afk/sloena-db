import { Machine } from '../types/machine';

export default function ComingSoon({ machine }: { machine: Machine }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-6xl mb-4">⚙</div>
      <h2 className="text-xl font-bold mb-2 text-slate-800">{machine.name}</h2>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        現在データ準備中です。
        <br />
        近日公開予定。
      </p>
    </div>
  );
}
