const sendNotification = (step, total, limit) => {
  chrome.permissions.contains({permissions: ['notifications']}, (result) => {
    if (result) {
      if (step > 0 && total >= limit || step < 0 && total <= limit) {
        chrome.notifications.getAll((items) => {
          if (items && Object.keys(items).length > 0) {
            //console.log('notification already opened:', items)
          } else {
            const options = {
              type: 'basic',
              iconUrl: 'Res/Icons/icon48.png',
              title: chrome.i18n.getMessage('notification_title'),
              message: chrome.i18n.getMessage('notification_message') + limit,
              requireInteraction: true,
              priority: 2
            }
            chrome.notifications.create('LimitReachedNotification', options, () => {
              chrome.notifications.onClicked.addListener(clearAllNotifications)
              chrome.notifications.onClosed.addListener(clearAllNotifications)
            })
          }
        })
      }
    }
  })
}

const clearAllNotifications = () => {
  chrome.notifications.getAll((items) => {
    if (items) {
      for (let key in items) {
        chrome.notifications.clear(key)
      }
    }
  })
}