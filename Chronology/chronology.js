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
  tableBody.innerHTML = ''
  chrome.storage.sync.get('chronology', (counter) => {
    if (counter.chronology) {
      const chronologyArray = counter.chronology
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

setDataInTable()

//Refresh table button
//document.getElementById('refresh_button').addEventListener('click', () => { location.reload() })

//Close page button
//document.getElementById('close').addEventListener('click', () => { window.close() })