import React, { useState, useEffect } from 'react';
import './App.css';
import { Query, QueryList } from './components/QueryList';

// Define a sample query for initial state when local storage is empty
const sample_query: Query = { id: 1, text: 'Sample query', videos: []};

function App() {
  // Define the state variable for storing the list of queries
  const [queries, setQueries] = useState<Query[]>([]);
  const [showResults, setShowResults] = useState(false); // State to control view
  const [selectedVideos, setSelectedVideos] = useState<{ id: string; title: string }[]>([]);
  const [selectedQueryText, setSelectedQueryText] = useState(''); // State to store the selected query text




  // Use useEffect to load queries from local storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get('queries', (result) => {
      if (result.queries === undefined) {
        // If 'queries' key doesn't exist in local storage, set the initial state with the sample query
        setQueries([sample_query]);
      } else {
        // If 'queries' key exists in local storage, set the state with the stored queries
        setQueries(result.queries);
      }
    });
  }, []);

  // Handler for editing a query
  const handleRenameQuery = (id: number, newText: string) => {
    // Create a new array with the updated query
    const updatedQueries = queries.map((query) =>
      query.id === id ? { ...query, text: newText } : query
    );
    // Update the state with the new array
    setQueries(updatedQueries);
    // Save the updated queries to local storage
    chrome.storage.local.set({ queries: updatedQueries });
  };

  // Handler for deleting a query
  const handleDeleteQuery = (id: number) => {
    // Create a new array without the deleted query
    const updatedQueries = queries.filter((query) => query.id !== id);
    // Update the state with the new array
    setQueries(updatedQueries);
    // Save the updated queries to local storage
    chrome.storage.local.set({ queries: updatedQueries });
  };

  // Handler for viewing the results of a query
  const handleViewResults = (queryText: string, videos: { id: string; title: string }[]) => {
    setSelectedQueryText(queryText); // Set the selected query text
    setSelectedVideos(videos); // Set the selected videos
    setShowResults(true); // Function to toggle results view
  };
  
  return (
    <div className="App">
      <h1>VideoInsights</h1>
      {showResults ? (
        <div>
          <h2>Results for: "{selectedQueryText}"</h2> {/* Display the selected query text */}
          <ol className="video-results-list">
            {selectedVideos.map((video) => (
              <li key={video.id}>
                <div>{video.title}</div>
                <iframe
                  width="333"
                  height="188"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </li>
            ))}
          </ol>
          <button onClick={() => setShowResults(false)}>Back to List</button>
        </div>
      ) : (
        <QueryList
          queries={queries}
          onRenameQuery={handleRenameQuery}
          onDeleteQuery={handleDeleteQuery}
          onViewResults={(queryText, videos) => handleViewResults(queryText, videos)} // Pass the query text to handleViewResults
        />
      )}
    </div>
  );
}

export default App;