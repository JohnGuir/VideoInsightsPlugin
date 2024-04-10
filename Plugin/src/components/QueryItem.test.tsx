import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryItem } from './QueryItem';

const mockQuery = {
  id: 1,
  text: 'Sample query',
};

describe('QueryItem', () => {
  it('renders query text', () => {
    render(<QueryItem query={mockQuery} onRename={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Sample query')).toBeInTheDocument();
  });

  it('renders edit, copy, and delete buttons', () => {
    render(<QueryItem query={mockQuery} onRename={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Rename')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', () => {
    render(<QueryItem query={mockQuery} onRename={() => {}} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Rename'));
    expect(screen.getByDisplayValue('Sample query')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onRename with the updated query when save button is clicked', () => {
    const handleRename = jest.fn();
    render(<QueryItem query={mockQuery} onRename={handleRename} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Rename'));
    fireEvent.change(screen.getByDisplayValue('Sample query'), {
      target: { value: 'Updated query' },
    });
    fireEvent.click(screen.getByText('Save'));
    expect(handleRename).toHaveBeenCalledWith('Updated query');
  });

  it('copies query text to clipboard when copy button is clicked', () => {
    /* mock the navigator.clipboard.writeText function to avoid actually interacting
       with the clipboard during the test. */
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    render(<QueryItem query={mockQuery} onRename={() => {}} onDelete={() => {}} />);
    fireEvent.click(screen.getByText('Copy'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Sample query');
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<QueryItem query={mockQuery} onRename={() => {}} onDelete={handleDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalled();
  });
});

