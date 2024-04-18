import React, { useState, useEffect } from 'react';
import './App.css';
import { Query, QueryList } from './components/QueryList';
import { homedir } from 'os';

// Define a sample query for initial state when local storage is empty
const sample_query: Query = { id: 1, text: 'Sample query', videos: []};

//Define the bookmark class
class Bookmark {
  id:string;
  title:string;
  currSite:string;
  constructor(id:string, title:string, currSite:string) {
    this.id = id;
    this.title = title;
    this.currSite = currSite;
  }
}
function App() {
  // Define the state variable for storing the list of queries
  const [queries, setQueries] = useState<Query[]>([]);
  const [showResults, setShowResults] = useState(false); // State to control view
  const [selectedVideos, setSelectedVideos] = useState<{ id: string; title: string }[]>([]);
  const [selectedQueryText, setSelectedQueryText] = useState(''); // State to store the selected query text
  //Define the state variable for bookmarks
  const [showBookmarks, setShowBookmarks] = useState(false); // State to control view





  // Use useEffect to load queries from local storage when the component mounts

  useEffect(() => {
    chrome.storage.local.get('queryResult', (result) => {
      if (result.queryResult === undefined) {
        // If 'queries' key doesn't exist in local storage, set the initial state with the sample query
        setQueries([sample_query]);
      } else {
        // If 'queries' key exists in local storage, set the state with the stored queries
        setQueries(result.queryResult);
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
    chrome.storage.local.set({ queryResult: updatedQueries });
  };

  // Handler for deleting a query
  const handleDeleteQuery = (id: number) => {
    // Create a new array without the deleted query
    const updatedQueries = queries.filter((query) => query.id !== id);
    // Update the state with the new array
    setQueries(updatedQueries);
    // Save the updated queries to local storage
    chrome.storage.local.set({ queryResult: updatedQueries });
  };

  // Handler for viewing the results of a query
  const handleViewResults = (queryText: string, videos: { id: string; title: string }[]) => {
    setSelectedQueryText(queryText); // Set the selected query text
    setSelectedVideos(videos); // Set the selected videos
    setShowResults(true); // Function to toggle results view
  };
  const showBookmarksView = () => {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
        //Get the url of the website
      chrome.storage.local.get({websiteURL: ""}, (urlResult) => {
        const url:string = urlResult.websiteURL;
        const siteBookmarks = bookmarks.filter((bookmarkEntry:Bookmark) => bookmarkEntry.currSite == url).map((bookmarkEntry:Bookmark) => ({id:bookmarkEntry.id, title:bookmarkEntry.title}));
        setSelectedVideos(siteBookmarks);
        setShowBookmarks(true);
      });
      })
      
  };
  const bookmarkVideo = (id:string, title:string) => {
    //Add this to the chrome storage bookmarks
      chrome.storage.local.get({ bookmarks: [] }, (result) => {
        const bookmarks = result.bookmarks;
        const existingBookmark = bookmarks.filter((bookmarkEntry:Bookmark) => bookmarkEntry.id == id)
        if(existingBookmark.length == 0){
          //Get the url of the website
          chrome.storage.local.get({websiteURL: ""}, (urlResult) => {
            const url:string = urlResult.websiteURL;
            const newBookmark = new Bookmark(id,title,url);
            bookmarks.unshift(newBookmark);
            console.log(bookmarks);
            chrome.storage.local.set({bookmarks});
          });
        }
        
      });
  }
  
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
                <button className="bookmark-button" onClick={() => bookmarkVideo(video.id,video.title)}>Bookmark</button>
              </li>
            ))}
          </ol>
          <button onClick={() => setShowResults(false)}>Back to Search</button>
        </div>
      ) : showBookmarks ? (
        <div>
          <h2>Bookmarks</h2> {/* Display the selected query text */}
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
          <button onClick={() => setShowBookmarks(false)}>Back to Search</button>
        </div>
      ) : (
        <div>
        <QueryList
          queries={queries}
          onRenameQuery={handleRenameQuery}
          onDeleteQuery={handleDeleteQuery}
          onViewResults={(queryText, videos) => handleViewResults(queryText, videos)} // Pass the query text to handleViewResults
        />
        <button onClick={() => showBookmarksView()}>Bookmarks</button>
        </div>
      )}
    </div>
  );
}

export default App;