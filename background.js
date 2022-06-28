chrome.runtime.onStartup.addListener( () => {
  chrome.storage.local.get('total', (counter) => {
    if (counter.total) {
      chrome.browserAction.setBadgeText({'text': counter.total.toString()})
    }  
  })
})

chrome.browserAction.onClicked.addListener( () => {
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

/*     chrome.storage.local.set({'total': newTotal}, () => {
      chrome.browserAction.setBadgeText({'text': newTotal.toString()})
        const newTimestamp = new Date().toLocaleString()
        chrome.storage.local.set({'timestamp': newTimestamp})
        if (counter.chronology) {
          const chronology = counter.chronology
          chronology.push(newTimestamp)
          if (chronology.length > 100) chronology.shift()
          chrome.storage.local.set({'chronology': chronology})
        }
    })
 */
    const newTimestamp = new Date().toLocaleString()

    //console.log('newTotal', newTotal)
      const chronology = counter.chronology || []
      chronology.push(newTimestamp)
      if (chronology.length > 100) chronology.shift()

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
      chrome.storage.sync.get(['total', 'step', 'limit', 'notification', 'sound', 'volume', 'timestamp', 'showTimestamp', 'chronology', 'chronologyOrder'], (counter) => {
        //console.log(counter.notification && (typeof counter.limit == 'string' && counter.limit.trim().length > 0 || typeof counter.limit == 'number'))
        let notification = counter.notification && (typeof counter.limit == 'string' && counter.limit.trim().length > 0 || typeof counter.limit == 'number') ? counter.notification : false
        let total = counter.total ? counter.total : 0
        let step = counter.step ? counter.step : 1
        let limit = counter.limit ? counter.limit : 0
        let sound = counter.sound ? counter.sound : false
        let volume = counter.volume ? counter.volume : 0.5
        let timestamp = counter.timestamp ? counter.timestamp : ''
        let showTimestamp = typeof counter.showTimestamp == 'boolean' ? counter.showTimestamp : true
        let chronology = counter.chronology ? counter.chronology : []
        let chronologyOrder = counter.chronologyOrder ? counter.chronologyOrder : 'oldest'
        if (typeof total == "string") { 
          total = Math.trunc(total * 10) / 10 
        } 
        if (typeof step == "string") { 
          step = Math.trunc(step * 10) / 10 
        }
        if (typeof limit == "string") { 
          if (limit.trim().length < 1 ) { notification = false }
          limit = Math.trunc(limit * 10) / 10 
        }
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