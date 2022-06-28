//Set texts in local language
const objects = document.getElementsByTagName('*')
for(let i = 0; i < objects.length; i++) {
  if (objects[i].hasAttribute('data-text')) {
    const textKey = objects[i].getAttribute('data-text')
    objects[i].innerText = chrome.i18n.getMessage(textKey)
  }
}

//Set data in table
const setDataInTable = () => {
  const tableBody = document.getElementById('chronology_table_body')
  //console.log(order)
  tableBody.innerHTML = ''
  chrome.storage.local.get(['chronology', 'chronologyOrder'], (counter) => {
    if (counter.chronology) {
      const order = counter.chronologyOrder ? counter.chronologyOrder : 'oldest'
      const chronologyArray = counter.chronology
      if(order === 'newest') chronologyArray.reverse()
      chronologyArray.map((click, index) => { 
        const clickTimeData = click.split(',')
        const clickDate = clickTimeData[0]  
        const clickHour = clickTimeData[1]
        const tableRow = document.createElement('tr')
        tableRow.classList.add('table-body-row')
        const tableRowContent = `
          <td class="rank-cell">${index + 1}.</td>
          <td>${clickDate}</td>
          <td>${clickHour}</td> 
        `
        tableRow.innerHTML = tableRowContent
        tableBody.appendChild(tableRow)
      })
    }
  })
}

chrome.storage.onChanged.addListener((changes) => {
  for(key in changes) {
    if (key === 'chronology') {
      setDataInTable()
      //location.reload()    
    }
  }  
})

//set selected order of chronology
chrome.storage.local.get('chronologyOrder', (counter) => {
  if (counter.chronologyOrder) {
    if (counter.chronologyOrder === 'newest') {
      document.getElementById('clicks_display_order').value = 'newest'
    }
  }
})  

document.getElementById('clicks_display_order').addEventListener('change', (e) => { 
  const newOrder = e.target.value
  //console.log(newOrder)
  chrome.storage.local.set({'chronologyOrder': newOrder}, () => { setDataInTable() })
})

setDataInTable()

//Refresh table button
//document.getElementById('refresh_button').addEventListener('click', () => { location.reload() })

//Close page button
//document.getElementById('close').addEventListener('click', () => { window.close() })