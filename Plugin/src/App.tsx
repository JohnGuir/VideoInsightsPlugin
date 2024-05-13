import React, { useState, useEffect } from "react";
import "./App.css";
import { Query, QueryList } from "./components/QueryList";
import { error } from "console";
import * as he from "he";

// Define a sample query for initial state when local storage is empty
// const sample_query: Query = { id: 1, text: "Sample query"};

function App() {
  // Define the state variable for storing the list of queries
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQueryText, setSelectedQueryText] = useState(""); // State to store the selected query text

  // Use useEffect to load queries from local storage when the component mounts

  useEffect(() => {
    chrome.storage.local.get("queries", (result) => {
      if (result.queries != undefined) {
        // If 'queries' key exists in local storage, set the state with the stored queries for url
        const queries = result.queries;
        chrome.storage.local.get({websiteURL: ""}, (urlResult) => {
          const url:string = urlResult.websiteURL;
          if((url in queries)){
            setQueries(queries[url]);
          }
        });
      }
    });
  }, []);
  // Handler for viewing the results of a query
  const handleViewResults = (
    queryText: string
    // videos: { id: string; title: string }[]
  ) => {
    setSelectedQueryText(queryText); // Set the selected query text
    const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=${encodeURIComponent(
      queryText
    )}&key=AIzaSyAdToL-Bk7O7goraaQkXMz8bm6kyvIInmk`;
    console.log(youtubeSearchUrl);
    chrome.windows.getCurrent().then((window) => {
      if (window && window.id !== undefined) {
        const windowId = window.id;
        chrome.storage.local.set({ search_text: queryText });
        chrome.sidePanel.open({ windowId });
      } else {
        console.error("Failed to get the current window");
      }
    });
  };

  const openSidePanel = () => {
    chrome.windows.getCurrent().then((window) => {
      if (window && window.id !== undefined) {
        const windowId = window.id;
        chrome.sidePanel.open({ windowId });
      } else {
        console.error("Failed to get the current window");
      }
    });
  };

  return (
    <div className="App">
      <h1>VideoInsights</h1>
        <div>
          <h2>Query History</h2>
          <QueryList
            queries={queries}
            onViewResults={(queryText) => handleViewResults(queryText)} // Pass the query text to handleViewResults
          />
          <button onClick={() => openSidePanel()}>Open Side Panel</button>
        </div>
    </div>
  );
}

export default App;
