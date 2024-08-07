//Set texts in local language
const objects = document.getElementsByTagName('*')
for(let i = 0; i < objects.length; i++) {
  if (objects[i].hasAttribute('data-text')) {
    const textKey = objects[i].getAttribute('data-text')
    objects[i].innerText = chrome.i18n.getMessage(textKey)
  }
}  

//Notify user when limit is reached
const notificationSetter = document.getElementById('notification_setter')
const limit = document.getElementById('limit')
const limitSwitch = document.getElementById('limit_switch')
const onOffIndicator = document.getElementById('on_off_label')

chrome.storage.local.get('notification', (counter) => {  
  if (counter.notification) {
    notificationSetter.classList.remove('inactive')
    limitSwitch.checked = true
    onOffIndicator.innerHTML = 'on'
  }
})

chrome.storage.local.get('limit', (counter) => {
  limit.value = counter.limit
})

limitSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    chrome.permissions.contains({
      permissions: ['notifications']
    }, (result) => {
      if (result) {
        //console.log('notifications permission already granted')
        chrome.storage.local.set({'notification': true})    
        notificationSetter.classList.remove('inactive')
        onOffIndicator.innerHTML = 'on'
      } else {
        chrome.permissions.request({permissions: ['notifications']}, (granted) => {
          if (granted) {
            chrome.storage.local.set({'notification': true})    
            notificationSetter.classList.remove('inactive')
            onOffIndicator.innerHTML = 'on'
          } else {
            e.target.checked = false
            chrome.storage.local.set({'notification': false})    
            notificationSetter.classList.add('inactive')
            onOffIndicator.innerHTML = 'off'
          }
        })
      }
    })
  } else {
    chrome.storage.local.set({'notification': false})    
    notificationSetter.classList.add('inactive')
    onOffIndicator.innerHTML = 'off'
  }
})

limit.addEventListener('change', () => {
  const limitValue = Math.trunc(limit.value * 10) / 10
  chrome.storage.local.set({'limit': limitValue})
  limit.value = limitValue
})

//Set counter step by
const step = document.getElementById('step')
chrome.storage.local.get('step', (counter) => {
  step.value = counter.step
})

step.addEventListener('change', (e) => {
  const stepValue = Math.trunc(step.value * 10) / 10
  chrome.storage.local.set({'step': stepValue})  
  step.value = stepValue  
})

//Set new counter total
const counterTotal = document.getElementById('total')
document.getElementById('set_new_total').addEventListener('click', (e) => {
  const totalValue = Math.trunc(counterTotal.value * 10) / 10
  chrome.storage.local.set({'total': totalValue}, () => {
    chrome.action.setBadgeText({'text': totalValue.toString()})
  })
  counterTotal.value = totalValue 
})

//Sound
const soundSetter = document.getElementById('sound_setter')
const soundSwitch = document.getElementById('sound_switch')
const soundOnOffIndicator = document.getElementById('on_off_label_sound')
const soundVolumeContainer = document.getElementById('sound_volume_container')
const volumeSlider = document.getElementById('sound_volume_slider')

chrome.storage.local.get(['sound', 'volume'], (counter) => {  
  if (counter.sound) {
    soundSetter.classList.remove('inactive')
    soundSwitch.checked = true
    soundOnOffIndicator.innerHTML = 'on'
    soundVolumeContainer.style.visibility = 'visible'
  }
  volumeSlider.value = counter.volume ? counter.volume : 0.5
})

soundSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    chrome.storage.local.set({'sound': true})    
    soundSetter.classList.remove('inactive')
    soundOnOffIndicator.innerHTML = 'on'
    soundVolumeContainer.style.visibility = 'visible'
  } else {
    chrome.storage.local.set({'sound': false})    
    soundSetter.classList.add('inactive')
    soundOnOffIndicator.innerHTML = 'off'
    soundVolumeContainer.style.visibility = 'hidden'
  }
})

volumeSlider.addEventListener('input', (e) => {
  const newVolume = parseFloat(volumeSlider.value)
  chrome.storage.local.set({'volume': newVolume})
})

//Timestamp
const timeStampSetter = document.getElementById('timestamp_setter')
const timeStampSwitch = document.getElementById('timestamp_switch')
const timeStampOffIndicator = document.getElementById('on_off_label_timestamp')

chrome.storage.local.get(['showTimestamp'], (counter) => {  
  if (counter.showTimestamp) {
    timeStampSetter.classList.remove('inactive')
    timeStampSwitch.checked = true
    timeStampOffIndicator.innerHTML = 'on'
  }
})

timeStampSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    chrome.storage.local.set({'showTimestamp': true})    
    timeStampSetter.classList.remove('inactive')
    timeStampOffIndicator.innerHTML = 'on'
  } else {
    chrome.storage.local.set({'showTimestamp': false})    
    timeStampSetter.classList.add('inactive')
    timeStampOffIndicator.innerHTML = 'off'
  }
})

//Open clicks chronology button
document.getElementById('chronology_button').addEventListener('click', () => { chrome.tabs.create({ url: chrome.runtime.getURL('Chronology/chronology.html') }) })

//Reset button
document.getElementById('reset').addEventListener('click', () => {
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
})

//Set keyboard shortcut button
document.getElementById('set_keyboard_shortcut_button').addEventListener('click', () => { chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }) })

//Close page button
document.getElementById('close').addEventListener('click', () => { window.close() })