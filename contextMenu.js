const setUpContextMenus = () => {
  chrome.contextMenus.removeAll(() => {
    //undo last click
    chrome.storage.sync.get(['total', 'step', 'limit', 'notification'], (counter) => {
      //undo last click context menu item
      let step = counter.step ? parseInt(counter.step) : 1
      step = -step
      let sign = Math.sign(step)
      sign = sign > -1 ? '+' : '' 
      const contextMenuUndoLastClickItem = {
        "id": "simpleCounterButtonUndoLastClickContextMenu",
        "title": `${sign}${step}`,
        "contexts": ["browser_action"]
      }
      chrome.contextMenus.create(contextMenuUndoLastClickItem, () => chrome.runtime.lastError)

      //reset counter context menu item
      const contextMenuCounterResetItem = {
        "id": "simpleCounterButtonResetCounterContextMenu",
        "title": chrome.i18n.getMessage("context_menu_reset_counter"),
        "contexts": ["browser_action"]
      }
      chrome.contextMenus.create(contextMenuCounterResetItem, () => chrome.runtime.lastError)
    })
  })
}


chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId == 'simpleCounterButtonResetCounterContextMenu') {
    chrome.storage.sync.set({'total': '0'}, () => {
      chrome.browserAction.setBadgeText({'text': '0'})
    })
  }

  if (clickData.menuItemId == 'simpleCounterButtonUndoLastClickContextMenu') {
    chrome.storage.sync.get(['total', 'step', 'limit', 'notification'], (counter) => {
      const step = counter.step ? parseInt(counter.step) : 1
      const InvertedStep = -step

      let newTotal = 0
      if (counter.total) {
        newTotal += parseInt(counter.total)
      }
  
      newTotal = newTotal + InvertedStep

      /* if (counter.limit && counter.notification) {
        sendNotification(step, newTotal, counter.limit)
      } */
  
      chrome.storage.sync.set({'total': newTotal}, () => {
        chrome.browserAction.setBadgeText({'text': newTotal.toString()})
      })
    })
  }
})

chrome.storage.onChanged.addListener((changes) => {
  for(key in changes) {
    if (key === 'step') {
      const newStep = -changes.step.newValue
      const sign = newStep >= 0 ? '+' : '' 
      chrome.contextMenus.update('simpleCounterButtonUndoLastClickContextMenu', {title: `${sign}${newStep}`}, () => chrome.runtime.lastError);
    }
  }
})
