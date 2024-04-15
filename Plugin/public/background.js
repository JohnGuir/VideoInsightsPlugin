import keywordExtractor from 'keyword-extractor';

// This function is called when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item
  // See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#method-create
  chrome.contextMenus.create({
    id: 'searchVideos', // Unique identifier for the context menu item
    title: 'Search Videos', // Text to be displayed in the context menu
    contexts: ['selection'], // Show the context menu item only when text is selected
  });
});

// This function is called when a context menu item is clicked
// See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#event-onClicked
// This function is called when a context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'searchVideos') {
    const query = info.selectionText;
    chrome.sidePanel.open({windowId: tab.windowId});

    // Extract keywords from the highlighted text
    const extractionResult = keywordExtractor.extract(query, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });

    // Sort the keywords by length (longer words first) and select the top N
    const topKeywords = extractionResult.sort((a, b) => b.length - a.length).slice(0, 5);

    // Join the top keywords to form a search query
    const keywords = topKeywords.join(' ');

    // Use the YouTube Data API to fetch the top video results for the processed query
    const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=${encodeURIComponent(keywords)}&key=AIzaSyAdToL-Bk7O7goraaQkXMz8bm6kyvIInmk`;

    fetch(youtubeSearchUrl)
      .then((response) => response.json())
      .then((data) => {
        // Extract video IDs and titles from the search results
        const videos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
        }));
        console.log('Top videos:', videos);

        // Save the query and associated videos to Chrome's storage
        chrome.storage.local.get({ queries: [] }, (result) => {
          const queries = result.queries;
          const newQuery = {
            id: Date.now(),
            text: query,
            videos: videos, // Save the videos with IDs and titles
          };
          queries.push(newQuery);
          chrome.storage.local.set({ queries });
        });
      }).catch((error) => {
        console.error('Error fetching YouTube search results:', error);
      });
  }
});