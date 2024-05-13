import React, { useState } from 'react';

export interface Query {
  id: number;
  text: string;
}

export interface QueryItemProps {
  query: Query;
  onViewResults: () => void;
}

export const QueryItem: React.FC<QueryItemProps> = ({ query, onViewResults }) => {

  return (
    <li className="query-item">
        <div>
          <span>{query.text}</span>
          <button onClick={onViewResults}>View Results</button>
        </div>
    </li>
  );
};
