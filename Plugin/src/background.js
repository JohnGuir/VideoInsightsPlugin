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

// chrome.action.onClicked.addListener((tab) => {
//   chrome.sidePanel.open({windowId: tab.windowId});
// })

// This function is called when a context menu item is clicked
// See: https://developer.chrome.com/docs/extensions/reference/api/contextMenus#event-onClicked
// This function is called when a context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'searchVideos') {
    const query = info.selectionText;
    chrome.storage.local.set({"search_text": info.selectionText});
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

        // Send the result to the frontend
        // const queryResult = {
        //   id: Date.now(),
        //   text: query,
        //   videos: videos,
        // }
        // chrome.storage.local.set({"queryResult":[queryResult]})

        //Store the current website URL
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      const url = tabs[0].url;
      chrome.storage.local.get({ queries: {} }, (result) => {
        let queries = result.queries;
        const newQuery = {
          id: Date.now(),
          text: query,
        };
        if(!(url in queries)){
          queries[url] = []
        }
        //Add query for this site, only store most recent 5

        //Check if query found
        let queryFound = false;
        for(let i=0; i<queries[url].length;i++){
          if(queries[url][i].text == newQuery.text){
            queryFound = true;
            break;
          }
        }
        if(!queryFound)
        {
          queries[url].unshift(newQuery);
          if(queries[url].length > 10){
            queries[url].pop();
          }
        }
        chrome.storage.local.set({ queries });
      });

  });
  }
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab){
      chrome.storage.local.set({"websiteURL":tab.url});
  });
});

chrome.tabs.onUpdated.addListener((tabID, changeInfo,tab) => {
  chrome.storage.local.set({"websiteURL":changeInfo.url});
  
})