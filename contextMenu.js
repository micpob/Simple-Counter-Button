const setUpContextMenus = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.sync.get(['step', 'timestamp', 'showTimestamp'], (counter) => {
      //revert click context menu item
      const step = -counter.step
      const sign = step >= 0 ? '+' : '' 
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
      
      //last click timestamp context menu item
      if (counter.showTimestamp) {
        const contextMenuLastClickTimestamp = {
          "id": "simpleCounterButtonLastClickTimestampContextMenu",
          "title": `${chrome.i18n.getMessage("context_menu_last_click_timestamp")} ${counter.timestamp}`,
          "contexts": ["browser_action"]
        }
        chrome.contextMenus.create(contextMenuLastClickTimestamp, () => chrome.runtime.lastError)
      }
    })
  })
}

chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId == 'simpleCounterButtonResetCounterContextMenu') {
    chrome.storage.sync.set({'total': 0}, () => {
      chrome.browserAction.setBadgeText({'text': '0'})
      chrome.permissions.contains({permissions: ['notifications']}, (result) => {
        if (result) {
          chrome.notifications.getAll((items) => {
            if (items) {
              for (let key in items) {
                chrome.notifications.clear(key)
              }
            }
          })
        }
      })
    })
  }

  if (clickData.menuItemId == 'simpleCounterButtonUndoLastClickContextMenu') {
    chrome.storage.sync.get(['total', 'step', 'limit', 'notification', 'sound', 'volume', 'chronology'], (counter) => {
      const step = counter.step
      let newTotal = counter.total - step

      if (!Number.isInteger(newTotal)) {
        const digitsBeforePoint = Math.ceil(Math.log10(Math.floor(Math.abs(newTotal))+1))
        const toPrecisionIndex = digitsBeforePoint + 1
        const preciseTotal = newTotal.toPrecision(toPrecisionIndex)
        newTotal = Math.trunc(preciseTotal * 10) / 10
      }

      /* if (counter.limit && counter.notification) {
        sendNotification(step, newTotal, counter.limit)
      } */

      //SOUND
      if (counter.sound) {
        const clickSound = new Audio(chrome.runtime.getURL('Res/Sounds/click_128.mp3'))
        clickSound.volume = counter.volume
        clickSound.play()
      }
  
      /* chrome.storage.sync.set({'total': newTotal}, () => {
        chrome.browserAction.setBadgeText({'text': newTotal.toString()})
          const newTimestamp = new Date().toLocaleString()
          chrome.storage.sync.set({'timestamp': newTimestamp})
          if (counter.chronology) {
            const chronology = counter.chronology
            chronology.push(newTimestamp)
            if (chronology.length > 100) chronology.shift()
            chrome.storage.sync.set({'chronology': chronology})
          }
      }) */

      const newTimestamp = new Date().toLocaleString()

      const chronology = counter.chronology
      chronology.push(newTimestamp)
      if (chronology.length > 100) chronology.shift()
  
      chrome.storage.sync.set({'total': newTotal, 'timestamp': newTimestamp, 'chronology': chronology}, () => {
        chrome.browserAction.setBadgeText({'text': newTotal.toString()})
      })

    })
  }

  if (clickData.menuItemId == 'simpleCounterButtonLastClickTimestampContextMenu') {
    chrome.tabs.create({ url: chrome.runtime.getURL('Chronology/chronology.html') })
  }

})

chrome.storage.onChanged.addListener((changes) => {
  for(key in changes) {
    if (key === 'step') {
      const newStep = -changes.step.newValue
      const sign = newStep >= 0 ? '+' : '' 
      chrome.contextMenus.update('simpleCounterButtonUndoLastClickContextMenu', {title: `${sign}${newStep}`}, () => chrome.runtime.lastError);
    }

    if (key === 'timestamp') {
      const newTimestamp = changes.timestamp.newValue
      chrome.storage.sync.get('showTimestamp', (counter) => {
        if (counter.showTimestamp) {
          chrome.contextMenus.update('simpleCounterButtonLastClickTimestampContextMenu', {title: `${chrome.i18n.getMessage("context_menu_last_click_timestamp")} ${newTimestamp}`}, () => chrome.runtime.lastError);
        }
      })
    }

    if (key === 'showTimestamp') {
      setUpContextMenus()    
    }
  }
})
