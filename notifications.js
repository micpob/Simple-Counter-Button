const sendNotification = (step, total, limit) => {
  if (step > 0 && total >= limit || step < 0 && total <= limit) {
    const options = {
      type: 'basic',
      iconUrl: 'Res/Icons/icon48.png',
      title: chrome.i18n.getMessage('notification_title'),
      message: chrome.i18n.getMessage('notification_message') + limit
    }
    chrome.notifications.create('LimitReachedNotification', options)          
  }
}