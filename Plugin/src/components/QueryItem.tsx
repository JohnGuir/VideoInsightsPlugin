import React, { useState } from 'react';

export interface Query {
  id: number;
  text: string;
  videos: { id: string; title: string }[];
}

export interface QueryItemProps {
  query: Query;
  onRename: (newQuery: string) => void;
  onDelete: () => void;
  onViewResults: () => void;
}

export const QueryItem: React.FC<QueryItemProps> = ({ query, onRename, onDelete, onViewResults }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [editedQuery, setRenamedQuery] = useState(query.text);

  const handleRenameClick = () => {
    setIsRenaming(true);
  };

  const handleSaveClick = () => {
    onRename(editedQuery);
    setIsRenaming(false);
  };

  return (
    <li className="query-item">
      {isRenaming ? (
        <div>
          <textarea
            value={editedQuery}
            onChange={(e) => setRenamedQuery(e.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div>
          <span>{query.text}</span>
          <button onClick={handleRenameClick}>Rename</button>
          <button onClick={onViewResults}>View Results</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};
