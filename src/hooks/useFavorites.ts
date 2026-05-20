import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sloena-favorites';

const DEFAULT_FAVORITES = [
  'tokyo-ghoul',
  'hokuto-tensei2',
  'god-kamigami',
  'kabaneri2',
  'bigdream',
  'monkey-v',
];

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_FAVORITES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch {
    return DEFAULT_FAVORITES;
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore write errors (private mode etc.)
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
