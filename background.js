chrome.runtime.onStartup.addListener( () => {
  chrome.storage.sync.get('total', (counter) => {
    let newTotal = 0
    if (counter.total) {
      newTotal += parseInt(counter.total)
    }
    chrome.browserAction.setBadgeText({'text': newTotal.toString()})
  })
})

chrome.browserAction.onClicked.addListener( () => {
  chrome.storage.sync.get(['total', 'step', 'limit', 'notification'], (counter) => {
    let step = 1
    if (counter.step) {
      step = parseInt(counter.step)
    }

    let newTotal = 0
    if (counter.total) {
      newTotal += parseInt(counter.total)
    }

    newTotal = newTotal + step

    if (counter.limit && counter.notification) {
      sendNotification(step, newTotal, counter.limit)
    }  

    chrome.storage.sync.set({'total': newTotal}, () => {
      chrome.browserAction.setBadgeText({'text': newTotal.toString()})
    })
  })
})

chrome.runtime.onInstalled.addListener((details) => {
  /* const currentVersion = chrome.runtime.getManifest().version
  const previousVersion = details.previousVersion */
  const reason = details.reason

  switch (reason) {
     case 'install':
      setUpContextMenus()
        break;
     case 'update':
      chrome.storage.sync.get('total', (counter) => {
        let newTotal = 0
        if (counter.total) {
          newTotal += parseInt(counter.total)
        }
        chrome.browserAction.setBadgeText({'text': newTotal.toString()})
      })
      chrome.contextMenus.removeAll(() => {
        setUpContextMenus()
      })
        break;
     case 'chrome_update':
        break;
     case 'shared_module_update':
        break;
     default:
        break;
  }
})