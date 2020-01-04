chrome.storage.sync.get('total', (counter) => {
  let newTotal = 0
  if (counter.total) {
    newTotal += parseInt(counter.total)
  }
  chrome.browserAction.setBadgeText({'text': newTotal.toString()})
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
      if (counter.limit && counter.notification) {
        if (step > 0 && newTotal >= counter.limit || step < 0 && newTotal <= counter.limit) {
          const options = {
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Limit reached!',
            message: 'You have reached the set limit of ' + counter.limit
          }
          chrome.notifications.create('LimitReachedNotification', options)          
        }
      }      
    })
    
    chrome.browserAction.setBadgeText({'text': newTotal.toString()})
  })

})