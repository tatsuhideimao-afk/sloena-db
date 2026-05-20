import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMachine } from '../hooks/useMachine';
import { useFavorites } from '../hooks/useFavorites';
import ExpectedValueCalculator from '../components/ExpectedValueCalculator';
import ModeTable from '../components/ModeTable';
import HintsList from '../components/HintsList';
import EndCardsList from '../components/EndCardsList';
import YameRules from '../components/YameRules';
import SourceFooter from '../components/SourceFooter';
import ComingSoon from '../components/ComingSoon';

const TABS = [
  { id: 'calc', label: '期待値' },
  { id: 'nerai', label: '狙い目' },
  { id: 'mode', label: 'モード' },
  { id: 'shotai', label: '招待状' },
  { id: 'end', label: '終了画面' },
  { id: 'zen', label: '前兆' },
  { id: 'yame', label: 'やめ時' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function MachineDetail() {
  const { id } = useParams();
  const { machine, loading } = useMachine(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [tab, setTab] = useState<TabId>('calc');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1410] text-stone-400 flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-[#0c1410] text-stone-100 flex flex-col items-center justify-center gap-3">
        <div>機種が見つかりません</div>
        <Link to="/" className="text-teal-400 text-sm">
          ← ホームに戻る
        </Link>
      </div>
    );
  }

  const fav = isFavorite(machine.id);

  return (
    <div className="min-h-screen bg-[#0c1410] text-stone-100">
      <div className="sticky top-0 z-10 bg-[#0c1410]/95 backdrop-blur border-b border-teal-900/30">
        <div className="px-3 py-2 flex items-center gap-2">
          <Link to="/" className="text-teal-400 text-sm shrink-0" aria-label="戻る">
            ←
          </Link>
          <h1 className="text-base font-bold tracking-wider flex-1 truncate">
            <span className="text-teal-400">{machine.shortName}</span>
            <span className="text-stone-400 text-xs ml-2">{machine.name}</span>
          </h1>
          <button
            onClick={() => toggleFavorite(machine.id)}
            aria-label={fav ? 'お気に入り解除' : 'お気に入り追加'}
            className={`text-lg shrink-0 ${fav ? 'text-teal-400' : 'text-stone-600'}`}
          >
            {fav ? '★' : '☆'}
          </button>
        </div>

        {machine.status === 'ready' && (
          <div className="flex overflow-x-auto px-1 pb-1 gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-sm border ${
                  tab === t.id
                    ? 'bg-teal-900/60 border-teal-400 text-white'
                    : 'bg-[#131c18] border-teal-900/30 text-stone-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 pb-24">
        {machine.status !== 'ready' ? (
          <ComingSoon machine={machine} />
        ) : (
          <>
            {tab === 'calc' && <ExpectedValueCalculator machine={machine} />}

            {tab === 'nerai' && (
              <div className="space-y-2">
                <div className="text-xs text-stone-400 mb-2">複数ソース集約の狙い目早見</div>
                {machine.neraiQuick?.map((n, i) => (
                  <div key={i} className="bg-[#131c18] rounded p-3 border border-teal-900/30">
                    <div className="text-sm font-bold text-teal-400">{n.type}</div>
                    <div className="text-base text-white mt-1">{n.threshold}</div>
                    <div className="text-xs text-stone-400 mt-1">{n.note}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'mode' && <ModeTable modes={machine.modes} />}

            {tab === 'shotai' && <HintsList hints={machine.hints} />}

            {tab === 'end' && (
              <EndCardsList endCards={machine.endCards} endCardsSetting={machine.endCardsSetting} />
            )}

            {tab === 'zen' && (
              <div className="space-y-2">
                <div className="text-xs text-stone-400 mb-2">液晶規定G到達時の前兆発生有無でモード示唆</div>
                {machine.zenchoPatterns?.map((z, i) => (
                  <div key={i} className="bg-[#131c18] rounded p-3 border border-teal-900/30">
                    <div className="text-sm font-bold text-teal-400">{z.g}</div>
                    <div className="text-xs text-stone-300 mt-1">{z.pattern}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'yame' && <YameRules rules={machine.yameRules} />}

            <SourceFooter sources={machine.sources} lastUpdated={machine.lastUpdated} />
          </>
        )}
      </div>
    </div>
  );
}
