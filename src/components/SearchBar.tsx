interface Props {
  onSearch: (query: string) => void;
  value: string;
}

export default function SearchBar({ onSearch, value }: Props) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="機種名で検索 (例: グール, 北斗)"
        className="w-full bg-[#131c18] border border-teal-900/30 rounded-lg px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:border-teal-400 focus:outline-none"
      />
    </div>
  );
}
