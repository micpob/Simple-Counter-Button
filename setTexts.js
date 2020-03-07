const objects = document.getElementsByTagName('*')
  for(let i = 0; i < objects.length; i++) {
    if (objects[i].hasAttribute('data-text')) {
      const textKey = objects[i].getAttribute('data-text')
      objects[i].innerText = chrome.i18n.getMessage(textKey)
    }
  }  