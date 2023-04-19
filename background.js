chrome.runtime.onStartup.addListener( () => {
  chrome.storage.local.get('total', (counter) => {
    if (counter.total) {
      chrome.browserAction.setBadgeText({'text': counter.total.toString()})
    } else {
      chrome.browserAction.setBadgeText({'text': '0'})
    }
  })
})

chrome.browserAction.onClicked.addListener( () => {
  const newTimestamp = Date.now()

  chrome.storage.local.get(['total', 'step', 'limit', 'notification', 'sound', 'volume', 'chronology'], (counter) => {
    const step = counter.step
    let newTotal = counter.total + step
    if (!Number.isInteger(newTotal)) {
      const digitsBeforePoint = Math.ceil(Math.log10(Math.floor(Math.abs(newTotal))+1))
      const toPrecisionIndex = digitsBeforePoint + 1
      const preciseTotal = newTotal.toPrecision(toPrecisionIndex)
      newTotal = Math.trunc(preciseTotal * 10) / 10
    }

    if (counter.notification) {
      const limit = counter.limit
      sendNotification(step, newTotal, limit)
    }  

    //SOUND
    if (counter.sound) {
      const clickSound = new Audio(chrome.runtime.getURL('Res/Sounds/click_128.mp3'))
      clickSound.volume = counter.volume
      clickSound.play()
    }

    const chronology = counter.chronology.length < 1000 ? counter.chronology : counter.chronology.slice(-99)
    chronology.push(newTimestamp)

    chrome.storage.local.set({'total': newTotal, 'timestamp': newTimestamp, 'chronology': chronology}, () => {
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
      chrome.storage.local.set({
        "limit": 0,
        "notification": false,
        "step": 1,
        "total": 0,
        "sound": false,
        "volume": 0.5,
        "timestamp": "",
        "showTimestamp": true,
        "chronology": [],
        "chronologyOrder": "oldest"
      }, () => {
        setUpContextMenus()
      })
        break;
     case 'update':
      chrome.storage.local.get(['total', 'step', 'limit', 'notification', 'sound', 'volume', 'timestamp', 'showTimestamp', 'chronology', 'chronologyOrder'], (counter) => {
        let notification = counter.notification ? counter.notification : false
        let total = counter.total ? counter.total : 0
        let step = counter.step ? counter.step : 1
        let limit = counter.limit ? counter.limit : 0
        let sound = counter.sound ? counter.sound : false
        let volume = counter.volume ? counter.volume : 0.5
        let timestamp = counter.timestamp ? counter.timestamp : ''
        let showTimestamp = typeof counter.showTimestamp == 'boolean' ? counter.showTimestamp : true
        let chronology = counter.chronology ? counter.chronology : []
        let chronologyOrder = counter.chronologyOrder ? counter.chronologyOrder : 'oldest'
        chrome.storage.local.set({
          "limit": limit,
          "step": step,
          "total": total,
          "notification": notification,
          "sound": sound,
          "volume": volume,
          "timestamp": timestamp,
          "showTimestamp": showTimestamp,
          "chronology": chronology,
          "chronologyOrder": chronologyOrder
        }, () => {
          chrome.browserAction.setBadgeText({'text': total.toString()})
          chrome.contextMenus.removeAll(() => {
            setUpContextMenus()
          })
        })
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