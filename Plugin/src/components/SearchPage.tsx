import React, { useState, useEffect } from "react";
import { Query, QueryList } from "./QueryList";
import "../App.css";
import { error } from "console";
import * as he from "he";

// Define a sample query for initial state when local storage is empty
const sample_query: Query = { id: 1, text: "Sample query", videos: [] };

//Define the bookmark class
class Bookmark {
  id: string;
  title: string;
  currSite: string;
  constructor(id: string, title: string, currSite: string) {
    this.id = id;
    this.title = title;
    this.currSite = currSite;
  }
}
function SearchPage() {
  // Define the state variable for storing the list of queries
  const [queries, setQueries] = useState<Query[]>([]);
  const [showResults, setShowResults] = useState(false); // State to control view
  const [selectedVideos, setSelectedVideos] = useState<
    { id: string; title: string }[]
  >([]);
  const [selectedQueryText, setSelectedQueryText] = useState(""); // State to store the selected query text
  //Define the state variable for bookmarks
  const [showBookmarks, setShowBookmarks] = useState(false); // State to control view
  const [searchText, setSearchText] = useState("");

  // Use useEffect to load queries from local storage when the component mounts

  useEffect(() => {
    chrome.storage.local.get("queryResult", (result) => {
      if (result.queryResult === undefined) {
        // If 'queries' key doesn't exist in local storage, set the initial state with the sample query
        setQueries([sample_query]);
      } else {
        // If 'queries' key exists in local storage, set the state with the stored queries
        setQueries(result.queryResult);
      }
    });

    chrome.storage.local.get("search_text", (result) => {
      if (result.search_text) {
        setSearchText(result.search_text);
      }
    });
  }, []);

  const handleTextChange = (event: { target: { value: any } }) => {
    const newValue = event.target.value;
    setSearchText(newValue);
    chrome.storage.local.set({ search_text: newValue });
  };

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
    var temp_videos: { id: string; title: string }[] = [];
    fetch(youtubeSearchUrl)
      .then((response) => response.json())
      .then((data: any) => {
        console.log(data);
        // Extract video IDs and titles from the search results
        temp_videos = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: he.decode(item.snippet.title),
        }));
        console.log("Top videos:", temp_videos);
        setSelectedVideos(temp_videos); // Set the selected videos
      })
      .catch((error) => {
        console.error("Error fetching YouTube search results:", error);
      });

    setShowResults(true); // Function to toggle results view
  };
  const showBookmarksView = () => {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      //Get the url of the website
      chrome.storage.local.get({ websiteURL: "" }, (urlResult) => {
        const url: string = urlResult.websiteURL;
        const siteBookmarks = bookmarks
          .filter((bookmarkEntry: Bookmark) => bookmarkEntry.currSite == url)
          .map((bookmarkEntry: Bookmark) => ({
            id: bookmarkEntry.id,
            title: bookmarkEntry.title,
          }));
        setSelectedVideos(siteBookmarks);
        setShowBookmarks(true);
      });
    });
  };
  const bookmarkVideo = (id: string, title: string) => {
    //Add this to the chrome storage bookmarks
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      const existingBookmark = bookmarks.filter(
        (bookmarkEntry: Bookmark) => bookmarkEntry.id == id
      );
      if (existingBookmark.length == 0) {
        //Get the url of the website
        chrome.storage.local.get({ websiteURL: "" }, (urlResult) => {
          const url: string = urlResult.websiteURL;
          const newBookmark = new Bookmark(id, title, url);
          bookmarks.unshift(newBookmark);
          console.log(bookmarks);
          chrome.storage.local.set({ bookmarks });
        });
      }
    });
  };

  return (
    <div className="App">
      <h1
        style={{
          marginTop: "20px",
        }}
      >
        VideoInsights
      </h1>
      {showResults ? (
        <div>
          {/* Display the selected query text */}
          <button
            onClick={() => setShowResults(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "red",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Back to Search
          </button>
          <h2>Results for: "{selectedQueryText}"</h2>{" "}
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
                <button
                  className="bookmark-button"
                  onClick={() => bookmarkVideo(video.id, video.title)}
                >
                  Bookmark
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : showBookmarks ? (
        <div>
          <h2>Bookmarks</h2> {/* Display the selected query text */}
          <button
            onClick={() => setShowBookmarks(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "red",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Back to Search
          </button>
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
          <button onClick={() => setShowBookmarks(false)}>
            Back to Search
          </button>
        </div>
      ) : (
        <div>
          <h2> Enter Your Search Below</h2>
          <input
            type="text"
            value={searchText}
            onChange={handleTextChange}
            placeholder="Enter search..."
          />
          <button onClick={() => handleViewResults(searchText)}>Search</button>
          <button onClick={() => showBookmarksView()}>Bookmarks</button>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
