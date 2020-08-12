const contextMenuItem = {
  "id": "simpleCounterButtonContextMenu",
  "title": chrome.i18n.getMessage("context_menu_reset_counter"),
  "contexts": ["browser_action"]
}
chrome.contextMenus.create(contextMenuItem)

chrome.contextMenus.onClicked.addListener(function (clickData) {
  if (clickData.menuItemId == 'simpleCounterButtonContextMenu') {
    chrome.storage.sync.set({'total': '0'})    
    chrome.browserAction.setBadgeText({'text': '0'})
  }
})