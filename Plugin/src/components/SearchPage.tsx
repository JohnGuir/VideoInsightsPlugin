import React, { useState, useEffect } from "react";
import { Query, QueryList } from "./QueryList";
import "../App.css";
import { error } from "console";
import * as he from "he";
import Slider from "./Slider"; 
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
// import ISO6391 from 'iso-639-1';
// import translate from 'translate-google';

// Define a sample query for initial state when local storage is empty
const sample_query: Query = { id: 1, text: "Sample query"};

// const translate = require('translate-google');
// const ISO6391 = require('iso-639-1');

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    marginTop: "20px",
    backgroundColor: "#f7f7f7", 
    padding: "20px",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "20px",
    backgroundColor: "#FF0000",  
    color: "#fff", 
    padding: "10px 20px",
    borderRadius: "10px", 
    display: "inline-block",
  },
  input: {
    padding: "10px",
    marginRight: "8px",
    marginBottom: "8px", 
    borderRadius: "20px", 
    border: "none",
    fontSize: "1rem",
  },
  button: {
    padding: "8px 16px", 
    borderRadius: "20px", 
    border: "none",
    backgroundColor: "#27ae60", 
    color: "#fff", 
    cursor: "pointer",
    fontSize: "1rem",
  },
  label: {
    fontSize: "1rem",
    marginRight: "8px",
    marginBottom: "100px"
  },
  select: {
    padding: "10px",
    marginBottom: "8px", 
    borderRadius: "20px", 
    border: "none",
    fontSize: "1rem",
    marginRight: "8px",
  },
  suggestions: { 
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px", 
    marginTop: "2px",
    textAlign: "left",
    zIndex: "1",
    width: "200px",
  },
  suggestionItem: {
    padding: "8px",
    cursor: "pointer",
  },
  resultsList: {
    listStyleType: "none",
    padding: "0",
  },
  resultItem: {
    marginBottom: "20px",
  },
  iframe: {
    width: "100%",
    height: "auto",
  },
  bookmarkButton: {
    backgroundColor: "#e74c3c", // Red button background
    color: "#fff", // White text color
    border: "none",
    padding: "8px 16px", // Smaller button size
    borderRadius: "20px", // Rounded borders
    cursor: "pointer",
    marginTop: "8px",
    fontSize: "0.5rem",
  },
  inlineButtons: {
    display: "inline-block",
    marginTop: "8px",
  },
};


//Define the bookmark class
class Bookmark {
  id: string;
  title: string;
  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}

function SearchPage() {
  // Define the state variables
  const [showResults, setShowResults] = useState(false); // State to control view
  const [selectedVideos, setSelectedVideos] = useState<
    { id: string; title: string }[]
  >([]);
  const [selectedQueryText, setSelectedQueryText] = useState(""); // State to store the selected query text
  const [showBookmarks, setShowBookmarks] = useState(false); // State to control view
  const [searchText, setSearchText] = useState("");
  const [maxDuration, setMaxDuration] = useState("any"); // State variable for maximum duration
  const [sortBy, setSortBy] = useState("relevance");
  const allLanguages = ["English", "French", "German", "Spanish", "Italian", "Russian", "Chinese", "Japanese", "Arabic", "Hindi", "Portuguese", "Korean", "Dutch", "Swedish", "Turkish", "Greek", "Polish", "Finnish", "Danish", "Norwegian", "Hungarian", "Czech", "Thai", "Indonesian", "Malay", "Vietnamese", "Tagalog", "Romanian", "Bulgarian", "Ukrainian", "Slovak", "Slovenian", "Croatian", "Serbian", "Lithuanian", "Latvian", "Estonian", "Maltese", "Icelandic", "Farsi", "Hebrew", "Urdu", "Tamil", "Telugu", "Bengali", "Gujarati", "Marathi", "Kannada", "Punjabi"];
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageValue, setLanguageValue] = useState("English");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleLanguageInput = (input: string) => {
    const filteredSuggestions = allLanguages.filter((language) =>
      language.toLowerCase().startsWith(input.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    setLanguageValue(input);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setSuggestions([]);
    setLanguageValue(language);
  };

  


  useEffect(() => {
    const listener = () => {
      chrome.storage.local.get("search_text", (result) => {
        if (result.search_text) {
          setSearchText(result.search_text);
          setShowResults(false);
        }
      })
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  useEffect(() => {
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

  const handleMaxDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxDuration(event.target.value);
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  // const ISO6391 = require('iso-639-1');
  // const translate = require('translate-google');

  const handleViewResults = (queryText: string) => {
    setSelectedQueryText(queryText);
    // const targetLanguageCode = ISO6391.getCode(selectedLanguage);
    // let fin = queryText; 
    let youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&relevanceLanguage=fr&videoDuration=${maxDuration}&order=${sortBy}&q=${encodeURIComponent(queryText + ' ' + selectedLanguage + ' ')}&key=AIzaSyBsZ3eg9UB-9cLRKARiqG5H9LAxTD-JIGg`
    var temp_videos: { id: string; title: string }[] = [];
    fetch(youtubeSearchUrl)
      .then((response) => response.json())
      .then((data: any) => {
        temp_videos = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: he.decode(item.snippet.title),
        }));
        console.log("Top videos:", temp_videos);
        chrome.storage.local.get({ websiteURL: "" }, (urlResult) => {
          const url: string = urlResult.websiteURL;
          chrome.storage.local.get({ queries: {} }, (result) => {
            let queries = result.queries;
            const newQuery = {
              id: Date.now(),
              text: queryText,
            };
            if (!(url in queries)) {
              queries[url] = []
            }
            let queryFound = false;
            for (let i = 0; i < queries[url].length; i++) {
              if (queries[url][i].text == newQuery.text) {
                queryFound = true;
                break;
              }
            }
            if (!queryFound) {
              queries[url].unshift(newQuery);
              if (queries[url].length > 10) {
                queries[url].pop();
              }
            }
            chrome.storage.local.set({ queries });
          });
        });
        setSelectedVideos(temp_videos);
      })
      .catch((error) => {
        console.error("Error fetching YouTube search results:", error);
      });

    setShowResults(true);
  };

  const showBookmarksView = () => {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      setSelectedVideos(bookmarks);
      setShowBookmarks(true);
    });
  };

  const bookmarkVideo = (id: string, title: string) => {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      const existingBookmark = bookmarks.filter(
        (bookmarkEntry: Bookmark) => bookmarkEntry.id == id
      );
      if (existingBookmark.length == 0) {
        const newBookmark = new Bookmark(id, title);
        bookmarks.unshift(newBookmark);
        chrome.storage.local.set({ bookmarks });
      }
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>VideoInsights</h1>
      {showResults ? (
        <div>
          <button
            onClick={() => setShowResults(false)}
            style={styles.button}
          >
            Back to Search
          </button>
          <h2>Results for: "{selectedQueryText}"</h2>
          <ol style={styles.resultsList}>
            {selectedVideos.map((video) => (
              <li key={video.id} style={styles.resultItem}>
                <div>{video.title}</div>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  style={styles.iframe}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button
                  style={styles.bookmarkButton}
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
          <h2>Bookmarks</h2>
          <button
            onClick={() => setShowBookmarks(false)}
            style={styles.button}
          >
            Back to Search
          </button>
          <ol style={styles.resultsList}>
            {selectedVideos.map((video) => (
              <li key={video.id} style={styles.resultItem}>
                <div>{video.title}</div>
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  style={styles.iframe}
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
            style={styles.input}
          />
          {/* <button onClick={() => handleViewResults(searchText)} style={styles.button}>Search</button>
          <button onClick={() => showBookmarksView()} style={styles.button}>Bookmarks</button> */}

          <div style={styles.inlineButtons}>
          <button onClick={() => handleViewResults(searchText)} style={styles.button}>Search</button>
          <button onClick={() => showBookmarksView()} style={styles.button}>Bookmarks</button>
          </div>
        

          <div>
          <label style={styles.label} htmlFor="languageInput">Language: </label>
            <input id="languageInput" type="text" value={languageValue} onChange={(e) => handleLanguageInput(e.target.value)} style={styles.input} />
            <div>
              {suggestions.map((suggestion, index) => (
                <div key={index} onClick={() => handleLanguageChange(suggestion)} style={styles.suggestionItem}>{suggestion}</div>
              ))}
            </div>
          </div>

          <div>
            <label style={styles.label} htmlFor="maxDuration">Maximum Duration: </label>
            <select
              id="maxDuration"
              value={maxDuration}
              onChange={handleMaxDurationChange}
              style={styles.select}
            >
              <option value="long">Long</option>
              <option value="medium">Medium</option>
              <option value="short">Short</option>
              <option value="any">Any</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" style={styles.label}>Sort By: </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortByChange}
              style={styles.select}
            >
              <option value="relevance">Relevance</option>
              <option value="viewCount">View Count</option>
              <option value="rating">Rating</option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
}

export default SearchPage;
