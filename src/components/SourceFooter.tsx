import { Source } from '../types/machine';

interface Props {
  sources?: Source[];
  lastUpdated: string;
}

export default function SourceFooter({ sources, lastUpdated }: Props) {
  return (
    <div className="mt-6 pt-4 border-t border-slate-200">
      <div className="text-xs text-slate-500 mb-2">データソース</div>
      {sources && sources.length > 0 ? (
        <ul className="space-y-1">
          {sources.map((s, i) => (
            <li key={i} className="text-xs">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-xs text-slate-400">出典準備中</div>
      )}
      <div className="text-xs text-slate-400 mt-3">最終更新: {lastUpdated}</div>
    </div>
  );
}
