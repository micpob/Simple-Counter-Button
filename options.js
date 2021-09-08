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
})


//Reset button
document.getElementById('reset').addEventListener('click', () => {
  chrome.storage.sync.set({'total': 0}, () => {
    chrome.browserAction.setBadgeText({'text': '0'})
  })
})

//Close page button
document.getElementById('close').addEventListener('click', () => { window.close() })