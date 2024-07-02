const setUpContextMenus = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.local.get(['step', 'timestamp', 'showTimestamp'], (counter) => {
      //revert click context menu item
      const step = -counter.step
      const sign = step >= 0 ? '+' : '' 
      const contextMenuUndoLastClickItem = {
        "id": "simpleCounterButtonUndoLastClickContextMenu",
        "title": `${sign}${step}`,
        "contexts": ["action"]
      }
      chrome.contextMenus.create(contextMenuUndoLastClickItem, () => chrome.runtime.lastError)

      //reset counter context menu item
      const contextMenuCounterResetItem = {
        "id": "simpleCounterButtonResetCounterContextMenu",
        "title": chrome.i18n.getMessage("context_menu_reset_counter"),
        "contexts": ["action"]
      }
      chrome.contextMenus.create(contextMenuCounterResetItem, () => chrome.runtime.lastError)
      
      //last click timestamp context menu item
      if (counter.showTimestamp) {
        const contextMenuLastClickTimestamp = {
          "id": "simpleCounterButtonLastClickTimestampContextMenu",
          "title": `${chrome.i18n.getMessage("context_menu_last_click_timestamp")} ${Number.isInteger(counter.timestamp) ? new Date(counter.timestamp).toLocaleString() : counter.timestamp}`,
          "contexts": ["action"]
        }
        chrome.contextMenus.create(contextMenuLastClickTimestamp, () => chrome.runtime.lastError)
      }

      //set keyboard shortcut
      const contextMenuSetkeyboardShortcut = {
        "id": "simpleCounterButtonSetkeyboardShortcutContextMenu",
        "title": chrome.i18n.getMessage("context_menu_set_keyboard_shortcut"),
        "contexts": ["action"]
      }
      chrome.contextMenus.create(contextMenuSetkeyboardShortcut, () => chrome.runtime.lastError)
    })
  })
}

async function playSound(source, volume) {
  await createOffscreen();
  await chrome.runtime.sendMessage({ play: { source, volume } });
}

chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId == 'simpleCounterButtonResetCounterContextMenu') {
    chrome.storage.local.set({'total': 0}, () => {
      chrome.action.setBadgeText({'text': '0'})
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
    const newTimestamp = Date.now()
    chrome.storage.local.get(['total', 'step', 'limit', 'notification', 'sound', 'volume', 'chronology'], (counter) => {
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
      /* if (counter.sound) {
        const clickSound = new Audio(chrome.runtime.getURL('Res/Sounds/click_128.mp3'))
        clickSound.volume = counter.volume
        clickSound.play()
      } */
      if (counter.sound) {
        const source = chrome.runtime.getURL('Res/Sounds/click_128.mp3')
        const volume = counter.volume
        playSound(source, volume)
      }
  
      const chronology = counter.chronology.length < 1000 ? counter.chronology : counter.chronology.slice(-99)
      chronology.push(newTimestamp)
  
      chrome.storage.local.set({'total': newTotal, 'timestamp': newTimestamp, 'chronology': chronology}, () => {
        chrome.action.setBadgeText({'text': newTotal.toString()})
      })

    })
  }

  if (clickData.menuItemId == 'simpleCounterButtonLastClickTimestampContextMenu') {
    chrome.tabs.create({ url: chrome.runtime.getURL('Chronology/chronology.html') })
  }

  if (clickData.menuItemId == 'simpleCounterButtonSetkeyboardShortcutContextMenu') {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
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
      let newTimestamp = changes.timestamp.newValue
      newTimestamp = new Date(newTimestamp).toLocaleString()
      chrome.storage.local.get('showTimestamp', (counter) => {
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
