import { useMemo, useState } from 'react';
import { allMachines } from '../data';
import { useFavorites } from '../hooks/useFavorites';
import SearchBar from '../components/SearchBar';
import MachineCard from '../components/MachineCard';

export default function Home() {
  const [query, setQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  const sorted = useMemo(
    () => [...allMachines].sort((a, b) => b.installations - a.installations),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((m) =>
      [m.name, m.shortName, m.manufacturer].some((s) => s.toLowerCase().includes(q))
    );
  }, [query, sorted]);

  const favorites = filtered.filter((m) => isFavorite(m.id));
  const others = filtered.filter((m) => !isFavorite(m.id));

  return (
    <div className="min-h-screen bg-[#eef4f1] text-slate-800">
      <header className="sticky top-0 bg-[#eef4f1]/95 backdrop-blur border-b border-slate-200 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold tracking-wider">
            <span className="text-teal-600">スロエナ</span>
            <span>DB</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">スマスロ ハイエナ稼働支援</p>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-12">
        <SearchBar value={query} onSearch={setQuery} />

        {favorites.length > 0 && (
          <section>
            <h2 className="text-sm text-teal-600 font-bold mb-2">★お気に入り</h2>
            <div className="space-y-2">
              {favorites.map((m) => (
                <MachineCard
                  key={m.id}
                  machine={m}
                  isFavorite={isFavorite(m.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm text-slate-500 font-bold mb-2">全機種(設置台数順)</h2>
          {others.length > 0 ? (
            <div className="space-y-2">
              {others.map((m) => (
                <MachineCard
                  key={m.id}
                  machine={m}
                  isFavorite={isFavorite(m.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500">該当する機種がありません</div>
          )}
        </section>
      </div>
    </div>
  );
}
