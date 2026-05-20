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
      <div className="min-h-screen bg-[#eef4f1] text-slate-500 flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-[#eef4f1] text-slate-800 flex flex-col items-center justify-center gap-3">
        <div>機種が見つかりません</div>
        <Link to="/" className="text-teal-600 text-sm">
          ← ホームに戻る
        </Link>
      </div>
    );
  }

  const fav = isFavorite(machine.id);

  return (
    <div className="min-h-screen bg-[#eef4f1] text-slate-800">
      <div className="sticky top-0 z-10 bg-[#eef4f1]/95 backdrop-blur border-b border-slate-200">
        <div className="px-3 py-2 flex items-center gap-2">
          <Link to="/" className="text-teal-600 text-sm shrink-0" aria-label="戻る">
            ←
          </Link>
          <h1 className="text-base font-bold tracking-wider flex-1 truncate">
            <span className="text-teal-600">{machine.shortName}</span>
            <span className="text-slate-500 text-xs ml-2">{machine.name}</span>
          </h1>
          <button
            onClick={() => toggleFavorite(machine.id)}
            aria-label={fav ? 'お気に入り解除' : 'お気に入り追加'}
            className={`text-lg shrink-0 ${fav ? 'text-teal-600' : 'text-slate-400'}`}
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
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'bg-[#ffffff] border-slate-200 text-slate-500'
                }`}
              >
                {t.id === 'shotai' ? machine.hintsLabel || '示唆' : t.label}
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
                <div className="text-xs text-slate-500 mb-2">複数ソース集約の狙い目早見</div>
                {machine.neraiQuick?.map((n, i) => (
                  <div key={i} className="bg-[#ffffff] rounded p-3 border border-slate-200">
                    <div className="text-sm font-bold text-teal-600">{n.type}</div>
                    <div className="text-base text-slate-900 mt-1">{n.threshold}</div>
                    <div className="text-xs text-slate-500 mt-1">{n.note}</div>
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
                <div className="text-xs text-slate-500 mb-2">液晶規定G到達時の前兆発生有無でモード示唆</div>
                {machine.zenchoPatterns?.map((z, i) => (
                  <div key={i} className="bg-[#ffffff] rounded p-3 border border-slate-200">
                    <div className="text-sm font-bold text-teal-600">{z.g}</div>
                    <div className="text-xs text-slate-600 mt-1">{z.pattern}</div>
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
