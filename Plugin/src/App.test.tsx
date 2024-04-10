import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as sinon from 'sinon';
import * as chrome from 'sinon-chrome';
import 'jest-sinon';
import App from './App';

(global as any).chrome = chrome;

describe('App', () => {
  afterEach(() => {
    chrome.flush();
  });

  it('renders VideoInsights header', async () => {
    chrome.storage.local.get.withArgs('queries').yields({ queries: [] });

    render(<App />);
    const headerElement = await screen.findByText(/VideoInsights/i);
    expect(headerElement).toBeInTheDocument();

    expect(chrome.storage.local.get).toHaveBeenCalledWith('queries');
  });

  it('renders sample query when queries are undefined in chrome storage', async () => {
    chrome.storage.local.get.withArgs('queries').yields({ queries: undefined });

    render(<App />);
    const queryElements = await screen.findAllByRole('listitem');
    expect(queryElements).toHaveLength(1);
    expect(queryElements[0]).toHaveTextContent('Sample query');
  });

  it('renders queries from chrome storage', async () => {
    const mockQueries = [
      { id: 1, text: 'Query 1' },
      { id: 2, text: 'Query 2' },
    ];
    chrome.storage.local.get.withArgs('queries').yields({ queries: mockQueries });

    render(<App />);
    const queryElements = await screen.findAllByRole('listitem');
    expect(queryElements).toHaveLength(2);
    expect(queryElements[0]).toHaveTextContent('Query 1');
    expect(queryElements[1]).toHaveTextContent('Query 2');
  });

  it('updates query in chrome storage when edited', async () => {
    const mockQueries = [
      { id: 1, text: 'Sample query' },
      { id: 2, text: 'Query 2' },
    ];
    chrome.storage.local.get.withArgs('queries').yields({ queries: mockQueries });

    render(<App />);
    const editButtons = await screen.findAllByText('Rename');
    expect(editButtons).toHaveLength(2);
    const editButton = editButtons[0];
    fireEvent.click(editButton);

    const textArea = await screen.findByDisplayValue('Sample query');
    fireEvent.change(textArea, { target: { value: 'Updated query' } });

    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      queries: [{ id: 1, text: 'Updated query' }, { id: 2, text: 'Query 2' }],
    });
  });

  it('removes query from chrome storage when deleted', async () => {
    const mockQueries = [{ id: 1, text: 'Query to delete' }];
    chrome.storage.local.get.withArgs('queries').yields({ queries: mockQueries });

    render(<App />);
    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ queries: [] });
  });

  it('sets initial state with sample query when local storage is empty', async () => {
    chrome.storage.local.get.withArgs('queries').yields({});

    render(<App />);
    const queryElements = await screen.findAllByRole('listitem');
    expect(queryElements).toHaveLength(1);
    expect(queryElements[0]).toHaveTextContent('Sample query');
  });

  it('sets initial state with empty array when queries key is an empty array in local storage', async () => {
    chrome.storage.local.get.withArgs('queries').yields({ queries: [] });

    render(<App />);
    const queryElements = screen.queryAllByRole('listitem');
    expect(queryElements).toHaveLength(0);
  });

  /*it('handles edited query with no changes', async () => {
    const mockQueries = [{ id: 1, text: 'Sample query' }];
    chrome.storage.local.get.withArgs('queries').yields({ queries: mockQueries });

    render(<App />);
    const editButton = await screen.findByText('Rename');
    fireEvent.click(editButton);

    const saveButton = await screen.findByText('Save');
    fireEvent.click(saveButton);

    expect(chrome.storage.local.set).not.toHaveBeenCalled();
  });*/
});