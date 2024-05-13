import React from 'react';
import { Query, QueryItem } from './QueryItem';

export type { Query } from './QueryItem';

export interface QueryListProps {
  queries: Query[];
  onViewResults: (queryText: string) => void;
}

export const QueryList: React.FC<QueryListProps> = ({
  queries,
  onViewResults,
}) => {
  return (
    <ul className="query-list">
      {queries.map((query) => (
        <QueryItem
          key={query.id}
          query={query}
          onViewResults={() => onViewResults(query.text)}
        />
      ))}
    </ul>
  );
};

export default QueryList;
