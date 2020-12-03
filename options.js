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
  if (counter.limit) {
    limit.value = parseInt(counter.limit)
  } else {
    limitSwitch.checked = false
    chrome.storage.sync.set({'notification': false})    
    notificationSetter.classList.add('inactive')
    onOffIndicator.innerHTML = 'off'
  }
})

limitSwitch.addEventListener('change', e => {
  if (e.target.checked) {
    chrome.storage.sync.set({'notification': true})    
    notificationSetter.classList.remove('inactive')
    onOffIndicator.innerHTML = 'on'
  } else {
    chrome.storage.sync.set({'notification': false})    
    notificationSetter.classList.add('inactive')
    onOffIndicator.innerHTML = 'off'
  }
})

limit.addEventListener('change', () => {
  chrome.storage.sync.set({'limit': limit.value})
})


//Set counter step by
const step = document.getElementById('step')
chrome.storage.sync.get('step', (counter) => {  
  if (counter.step) {
    step.value = parseInt(counter.step)
  } else {
    step.value = 1
  }  
})

step.addEventListener('change', () => {
  chrome.storage.sync.set({'step': step.value})    
})


//Set new counter total
const counterTotal = document.getElementById('total')
document.getElementById('set_new_total').addEventListener('click', () => {
  chrome.storage.sync.set({'total': counterTotal.value})    
  chrome.browserAction.setBadgeText({'text': counterTotal.value})
})


//Reset button
document.getElementById('reset').addEventListener('click', () => {
  chrome.storage.sync.set({'total': '0'}, () => {
    chrome.browserAction.setBadgeText({'text': '0'})
  })
})

//Close page button
document.getElementById('close').addEventListener('click', () => { window.close() })
