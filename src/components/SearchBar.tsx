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
        className="w-full bg-[#ffffff] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
      />
    </div>
  );
}
