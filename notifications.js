const sendNotification = (step, total, limit) => {
  if (step > 0 && total >= limit || step < 0 && total <= limit) {
    const options = {
      type: 'basic',
      iconUrl: 'Res/Icons/icon48.png',
      title: chrome.i18n.getMessage('notification_title'),
            chrome.notifications.create('LimitReachedNotification', options, () => {
              chrome.notifications.onClicked.addListener(clearAllNotifications)
              chrome.notifications.onClosed.addListener(clearAllNotifications)
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