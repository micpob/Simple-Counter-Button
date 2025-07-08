//Set texts in local language
const objects = document.getElementsByTagName('*')
for(let i = 0; i < objects.length; i++) {
  if (objects[i].hasAttribute('data-text')) {
    const textKey = objects[i].getAttribute('data-text')
    objects[i].innerText = chrome.i18n.getMessage(textKey)
  }
}

//Set export table to csv file button title
const exportButton = document.getElementById('export_button')
exportButton.title = chrome.i18n.getMessage('export_chronology_table_to_csv_file_button_title')

const timeDiff = (date1, date2) => {
  const difference = date1 > date2 ? date1 - date2 : date2 - date1

  let diff = Math.floor(difference), units = [
    { d: 1000, l: `${chrome.i18n.getMessage("milliseconds")}` },
    { d: 60, l: `${chrome.i18n.getMessage("seconds")},` },
    { d: 60, l: `${chrome.i18n.getMessage("minutes")},` },
    { d: 24, l: `${chrome.i18n.getMessage("hours")},` },
    { d: 365, l: `${chrome.i18n.getMessage("days")},` },
    /* { d: 52, l: "weeks" } */
  ]

  let result = []
  for (let i = 0; i < units.length; i++) {
    //result = `${(diff % units[i].d)}${units[i].l} ${result}`
    result.push(diff % units[i].d)
    diff = Math.floor(diff / units[i].d)
  }

  result.reverse()

  const timeUnits = [
    `${chrome.i18n.getMessage("days")}`,
    `${chrome.i18n.getMessage("hours")}`,
    `${chrome.i18n.getMessage("minutes")}`,
    `${chrome.i18n.getMessage("seconds")}`,
    `${chrome.i18n.getMessage("milliseconds")}`
  ]

  let timeInString = ''
  for (let i = 0; i < result.length; i++) {
    if (result[i] === 0 && timeInString.length === 0) {

    } else {
      timeInString = timeInString.length > 0 ? `${timeInString}, ${result[i]}${timeUnits[i]}` : `${result[i]}${timeUnits[i]}`
    }
    //console.log(timeInString)
  }
  
  return timeInString
}

//Set data in table
const setDataInTable = () => {
  const tableBody = document.getElementById('chronology_table_body')
  //console.log(order)
  tableBody.innerHTML = ''
  chrome.storage.local.get(['chronology', 'chronologyOrder'], (counter) => {
    if (counter.chronology) {
      const order = counter.chronologyOrder ? counter.chronologyOrder : 'oldest'
      const chronologyArray = counter.chronology.slice(-200)
      if(order === 'newest') chronologyArray.reverse()
      chronologyArray.map((click, index, array) => { 
        if (index === chronologyArray.length - 1) {
          document.getElementById('reset_chronology_button_container').style.visibility = 'visible'
        }
        if (Number.isInteger(click)) {
          const previousClick = order === 'oldest' ? array[index-1] : array[index+1]
          const timestamp = new Date(click)
          const clickDate = timestamp.toLocaleDateString()  
          const clickHour = timestamp.toLocaleTimeString()
          const interval = Number.isInteger(previousClick) ? timeDiff(click, previousClick) : '-'
          const tableRow = document.createElement('tr')
          tableRow.classList.add('table-body-row')
          const tableRowContent = `
            <td class="rank-cell">${index + 1}.</td>
            <td>${clickDate}</td>
            <td>${clickHour}</td> 
            <td class="interval-cell">${interval}</td> 
          `
          tableRow.innerHTML = tableRowContent
          tableBody.appendChild(tableRow)
        } else {
          const clickTimeData = click.split(',')
          const clickDate = clickTimeData[0]  
          const clickHour = (typeof clickTimeData[1] === 'undefined') ? '' : clickTimeData[1]
          const tableRow = document.createElement('tr')
          tableRow.classList.add('table-body-row')
          const tableRowContent = `
            <td class="rank-cell">${index + 1}.</td>
            <td>${clickDate}</td>
            <td>${clickHour}</td> 
            <td>-</td> 
          `
          tableRow.innerHTML = tableRowContent
          tableBody.appendChild(tableRow)
        }
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

document.getElementById('reset_chronology_button').addEventListener('click', () => { 
  chrome.storage.local.set({
    "chronology": []
  }, () => {
    document.getElementById('reset_chronology_button_container').style.visibility = 'hidden'
    setDataInTable()
  }) 
})

setDataInTable()
