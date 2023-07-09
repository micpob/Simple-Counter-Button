//Set texts in local language
const objects = document.getElementsByTagName('*')
for(let i = 0; i < objects.length; i++) {
  if (objects[i].hasAttribute('data-text')) {
    const textKey = objects[i].getAttribute('data-text')
    objects[i].innerText = chrome.i18n.getMessage(textKey)
  }
}

function timeDiff( date1, date2 ) {

  const difference = date1 > date2 ? date1 - date2 : date2 - date1
  var diff = Math.floor((difference) / 1000), units = [
    /* { d: 1000, l: "ms" }, */
    { d: 60, l: "s" },
    { d: 60, l: "m" },
    { d: 24, l: "h" },
    { d: 365, l: "d" },
    /* { d: 52, l: "weeks" } */
  ];

  var s = '';
  for (var i = 0; i < units.length; ++i) {
    s = (diff % units[i].d) + " " + units[i].l + " " + s;
    diff = Math.floor(diff / units[i].d);
  }
  return s;
}

const timeDifference = (date1, date2) => {
  const difference = date1 > date2 ? date1 - date2 : date2 - date1

  console.log('difference:', difference)

  const differenceDate = new Date(difference)

  var hoursDifference2 = differenceDate.getUTCHours()

  console.log('hoursDifference2:', hoursDifference2)

  var minutesDifference2 = differenceDate.getUTCMinutes()

  var secondsDifference2 = differenceDate.getUTCSeconds()

  var millisecondsDifference2 = differenceDate.getUTCMilliseconds()

  return `${hoursDifference2}h ${minutesDifference2}m ${secondsDifference2}s ${millisecondsDifference2}ms`


  /* var daysDifference = Math.floor(difference/1000/60/60/24)
  difference -= daysDifference*1000*60*60*24 */

  let hoursDifference = Math.round((difference / (1000 * 60 * 60)) % 24)
  hoursDifference = hoursDifference < 10 ? /* '0' + */ hoursDifference : hoursDifference

  let minutesDifference = Math.round((difference / (1000 * 60)) % 60)
  minutesDifference = minutesDifference < 10 ? /* '0' + */ minutesDifference : minutesDifference

  let secondsDifference = Math.round((difference / 1000) % 60)
  secondsDifference = secondsDifference < 10 ? /* '0' + */ secondsDifference : secondsDifference
  
  let millisecondsDifference = Math.round((difference % 1000) / 100)

  return `${hoursDifference}h ${minutesDifference}m ${secondsDifference}s ${millisecondsDifference}ms`
  
  return `${hoursDifference}:${minutesDifference}:${secondsDifference}.${millisecondsDifference}`

  return `${hoursDifference}:${minutesDifference}:${secondsDifference}`

  /* let hoursDifference = Math.floor(difference/1000/60/60)
  hoursDifference = hoursDifference < 10 ? '0' + hoursDifference : hoursDifference
  difference -= hoursDifference*1000*60*60

  let minutesDifference = Math.floor(difference/1000/60)
  minutesDifference = minutesDifference < 10 ? '0' + minutesDifference : minutesDifference
  difference -= minutesDifference*1000*60

  let secondsDifference = Math.floor(difference/1000)
  secondsDifference = secondsDifference < 10 ? '0' + secondsDifference : secondsDifference

  return `${hoursDifference}:${minutesDifference}:${secondsDifference}` */



  var daysDifference = Math.floor(difference/1000/60/60/24);

  return daysDifference;

  var milliseconds = Math.floor((difference % 1000) / 100),
  seconds = Math.floor((difference / 1000) % 60),
  minutes = Math.floor((difference / (1000 * 60)) % 60),
  hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;


  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;






  return `${difference}`
   
  console.log('difference = ' + 
    daysDifference + ' day/s ' + 
    hoursDifference + ' hour/s ' + 
    minutesDifference + ' minute/s ' + 
    secondsDifference + ' second/s ');
}

//Set data in table
const setDataInTable = () => {
  const tableBody = document.getElementById('chronology_table_body')
  //console.log(order)
  tableBody.innerHTML = ''
  chrome.storage.local.get(['chronology', 'chronologyOrder'], (counter) => {
    if (counter.chronology) {
      const order = counter.chronologyOrder ? counter.chronologyOrder : 'oldest'
      const chronologyArray = counter.chronology.slice(-100)
      if(order === 'newest') chronologyArray.reverse()
      chronologyArray.map((click, index, array) => { 
        if (Number.isInteger(click)) {
          /* console.log(array)
          console.log(array[index-1]) */
          const previousClick = order === 'oldest' ? array[index-1] : array[index+1]
          console.log('click:', click, 'previousClick:', previousClick)
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
            <td>${interval}</td> 
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
            <td>${interval}</td> 
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

setDataInTable()

//Refresh table button
//document.getElementById('refresh_button').addEventListener('click', () => { location.reload() })

//Close page button
//document.getElementById('close').addEventListener('click', () => { window.close() })