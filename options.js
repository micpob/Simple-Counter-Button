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

chrome.storage.sync.get('notification', (counter) => {  
  if (counter.notification) {
    notificationSetter.classList.remove('inactive')
    limitSwitch.checked = true
    onOffIndicator.innerHTML = 'on'
  }
})

chrome.storage.sync.get('limit', (counter) => {
  limit.value = counter.limit
})

limitSwitch.addEventListener('change', (e) => {
  if (e.target.checked) {
    chrome.permissions.contains({
      permissions: ['notifications']
    }, (result) => {
      if (result) {
        //console.log('notifications permission already granted')
      } else {
        chrome.permissions.request({
          permissions: ['notifications']
        }, (granted) => {
          if (granted) {
            chrome.storage.sync.set({'notification': true})    
            notificationSetter.classList.remove('inactive')
            onOffIndicator.innerHTML = 'on'
          } else {
            e.target.checked = false
            chrome.storage.sync.set({'notification': false})    
            notificationSetter.classList.add('inactive')
            onOffIndicator.innerHTML = 'off'
          }
        })
      }
    })
  } else {
    chrome.storage.sync.set({'notification': false})    
    notificationSetter.classList.add('inactive')
    onOffIndicator.innerHTML = 'off'
  }
})

limit.addEventListener('change', () => {
  const limitValue = Math.trunc(limit.value * 10) / 10
  chrome.storage.sync.set({'limit': limitValue})
  limit.value = limitValue
})

//Set counter step by
const step = document.getElementById('step')
chrome.storage.sync.get('step', (counter) => {
  step.value = counter.step
})

step.addEventListener('change', (e) => {
  const stepValue = Math.trunc(step.value * 10) / 10
  chrome.storage.sync.set({'step': stepValue})  
  step.value = stepValue  
})

//Set new counter total
const counterTotal = document.getElementById('total')
document.getElementById('set_new_total').addEventListener('click', (e) => {
  const totalValue = Math.trunc(counterTotal.value * 10) / 10
  chrome.storage.sync.set({'total': totalValue}, () => {
    chrome.browserAction.setBadgeText({'text': totalValue.toString()})
  })
  counterTotal.value = totalValue 
})

//Sound
const soundSetter = document.getElementById('sound_setter')
const soundSwitch = document.getElementById('sound_switch')
const soundOnOffIndicator = document.getElementById('on_off_label_sound')
const soundVolumeContainer = document.getElementById('sound_volume_container')
const volumeSlider = document.getElementById('sound_volume_slider')

chrome.storage.sync.get(['sound', 'volume'], (counter) => {  
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
    chrome.storage.sync.set({'sound': true})    
    soundSetter.classList.remove('inactive')
    soundOnOffIndicator.innerHTML = 'on'
    soundVolumeContainer.style.visibility = 'visible'
  } else {
    chrome.storage.sync.set({'sound': false})    
    soundSetter.classList.add('inactive')
    soundOnOffIndicator.innerHTML = 'off'
    soundVolumeContainer.style.visibility = 'hidden'
  }
})

volumeSlider.addEventListener('input', (e) => {
  const newVolume = parseFloat(volumeSlider.value)
  chrome.storage.sync.set({'volume': newVolume})
})

//Reset button
document.getElementById('reset').addEventListener('click', () => {
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
})

//Close page button
document.getElementById('close').addEventListener('click', () => { window.close() })