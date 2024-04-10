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

    // Extract keywords from the highlighted text
    const extractionResult = keywordExtractor.extract(query, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });

    // Join the keywords to form a search query
    const keywords = extractionResult.join(' ');

    // Construct the YouTube search URL using the keywords
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(keywords)}`;
    chrome.tabs.create({ url: searchUrl });
  }
});