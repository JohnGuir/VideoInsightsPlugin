import React from 'react';
import { Query, QueryItem } from './QueryItem';

export type { Query } from './QueryItem';

export interface QueryListProps {
  queries: Query[];
  onRenameQuery: (id: number, newQuery: string) => void;
  onDeleteQuery: (id: number) => void;
  onViewResults: (queryText: string, videos: { id: string; title: string }[]) => void;
}

export const QueryList: React.FC<QueryListProps> = ({
  queries,
  onRenameQuery,
  onDeleteQuery,
  onViewResults,
}) => {
  return (
    <ul className="query-list">
      {queries.map((query) => (
        <QueryItem
          key={query.id}
          query={query}
          onRename={(newQuery) => onRenameQuery(query.id, newQuery)}
          onDelete={() => onDeleteQuery(query.id)}
          onViewResults={() => onViewResults(query.text, query.videos)}
        />
      ))}
    </ul>
  );
};

export default QueryList;
