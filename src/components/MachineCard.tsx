import { Link } from 'react-router-dom';
import { Machine } from '../types/machine';

interface Props {
  machine: Machine;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function MachineCard({ machine, isFavorite, onToggleFavorite }: Props) {
  return (
    <Link to={`/machines/${machine.id}`} className="block">
      <div className="bg-[#131c18] border border-teal-900/30 rounded-lg p-3 hover:border-teal-400 transition-colors">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(machine.id);
              }}
              aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
              className={`text-lg leading-none mt-0.5 ${isFavorite ? 'text-teal-400' : 'text-stone-600'}`}
            >
              {isFavorite ? '★' : '☆'}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-stone-100 truncate">{machine.name}</div>
              <div className="text-xs text-stone-400 mt-0.5">{machine.manufacturer}</div>
            </div>
          </div>
          {machine.status === 'preparing' && (
            <span className="shrink-0 text-xs bg-orange-900/30 text-orange-300 px-2 py-0.5 rounded">準備中</span>
          )}
        </div>
        <div className="flex justify-between items-baseline mt-2 text-xs text-stone-500">
          <span>{machine.installations.toLocaleString()}店舗</span>
          <span>更新: {machine.lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
}
