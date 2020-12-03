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

    chrome.storage.sync.set({'total': newTotal}, () => {
      chrome.browserAction.setBadgeText({'text': newTotal.toString()})
      if (counter.limit && counter.notification) {
        if (step > 0 && newTotal >= counter.limit || step < 0 && newTotal <= counter.limit) {
          const options = {
            type: 'basic',
            iconUrl: 'Res/Icons/icon48.png',
            title: chrome.i18n.getMessage('notification_title'),
            message: chrome.i18n.getMessage('notification_message') + counter.limit
          }
          chrome.notifications.create('LimitReachedNotification', options)          
        }
      }      
    })
  })
})