chrome.contextMenus.removeAll(() => {
  const contextMenuItem = {
    "id": "simpleCounterButtonResetCounterContextMenu",
    "title": chrome.i18n.getMessage("context_menu_reset_counter"),
    "contexts": ["browser_action"]
  }
  chrome.contextMenus.create(contextMenuItem)
  if (chrome.runtime.lastError) {  }
  
  chrome.contextMenus.onClicked.addListener((clickData) => {
    if (clickData.menuItemId == 'simpleCounterButtonResetCounterContextMenu') {
      chrome.storage.sync.set({'total': '0'}, () => {
        chrome.browserAction.setBadgeText({'text': '0'})
      })    
    }
  })
  

})
