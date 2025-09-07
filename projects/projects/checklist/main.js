let totalItems = 0
let loadedData = {}
let fp = null
let downloadList = {
    "title": "",
    "checklist": {
    }
}


window.addEventListener("DOMContentLoaded", function() {

   fp = flatpickr("#additem-pickdate", {
    enableTime: true,
    dateFormat: "U"
   });

   let fileInput = this.document.getElementById("uploadinput")
   fileInput.addEventListener("change", function(event) {

      console.log("File added!")
      create_toast("Success!", "Your file has been uploaded.")
      
      let file = event.currentTarget.files[0]
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {

         console.log("File reader loaded!")

         loadedData = JSON.parse(reader.result)
         console.log(loadedData)

         for (let key in loadedData.checklist) {
            console.log(loadedData.checklist[key].checked)
            add_item(key, loadedData.checklist[key].date, loadedData.checklist[key].checked)
         }
      }

      reader.readAsText(file)

   })

    let title = document.getElementById("title")
    title.addEventListener("change", function() {
      if (title.value == "") {
         title.value = "My Checklist"
      }
    })
    

   setInterval(() => {
      update_deadlines()
   }, 1000);

})

function add_item(content, deadline, status) {

   let list = document.getElementById("list")
   let newItem = content
   let unit = "mills"
   let timer = 0

   // Checks if current time remaining in milliseconds is less than a threshhold
   if (deadline - Date.now() <= 59999) {

      unit = "secs"
      timer = (deadline - Date.now())/1000

   } else if (deadline - Date.now() <= 3599999) {

      unit = "mins"
      timer = ((deadline - Date.now())/1000)/60

   } else if (deadline - Date.now() <= 86399999) {

      unit = "hrs"
      timer = (((deadline - Date.now())/1000)/60)/60

   } else if (deadline - Date.now() <= 2591999999) {

      unit = "days"
      timer = ((((deadline - Date.now())/1000)/60)/60)/24

   } else if (deadline - Date.now() <= 31535999999) {

      unit = "mths"
      timer = (((((deadline - Date.now())/1000)/60)/60)/24)/30

   } else {

      unit = "yrs"
      timer = (((((deadline - Date.now())/1000)/60)/60)/24)/365

   }

   console.log(deadline - Date.now())
   console.log(timer)

   if (newItem && deadline) {

      let item = document.createElement('div')
      item.classList.add("item")

      let itemContent = document.createElement('div')
      itemContent.classList.add("item-content")

      let itemCheck = document.createElement('input')
      itemCheck.classList.add("item-check")
      itemCheck.type = "checkbox"

      let itemText = document.createElement('p')
      itemText.classList.add("item-text")
      itemText.innerHTML = newItem

      let itemDate = document.createElement('p')
      itemDate.classList.add("item-date")
      itemDate.value = deadline
      if (deadline - Date.now() < 1) {
         itemDate.innerHTML = "expired"
      } else {
         itemDate.innerHTML = `${Math.round(timer)} ${unit}`
      }

      let itemRemove = document.createElement('button')
      itemRemove.classList.add('item-remove')
      itemRemove.innerHTML = "X"

      list.appendChild(item)
      item.appendChild(itemCheck)
      item.appendChild(itemContent)
      itemContent.appendChild(itemText)
      item.appendChild(itemDate)
      item.appendChild(itemRemove)

      if (status) {
         itemCheck.checked = true
         itemText.style.textDecoration = "line-through"
         item.style.backgroundColor = "#ececec"
         itemText.style.color = "#5c5c5c"
      }

      itemCheck.addEventListener("change", function() {

         if (this.checked) {
            itemText.style.textDecoration = "line-through"
            item.style.backgroundColor = "#ececec"
            itemText.style.color = "#5c5c5c"
         } else {
            itemText.style.textDecoration = "none"
            item.style.backgroundColor = "#ffffff"
            itemText.style.color = "#000000"
         }

      })

      itemRemove.addEventListener('click', function() {

         itemRemove.parentElement.classList.add("item-delete-animation")

         setTimeout(() => {
            totalItems--
            itemRemove.parentElement.remove()
         }, 200);

      })

      totalItems++
      document.getElementById("additem-input").value = ""

   } else {
      create_toast("Woah there!", "You need to include both a title and a deadline for your item.")
   }

}

function update_deadlines() {

   let dates = document.querySelectorAll('.item-date')

   if (dates) {

      dates.forEach(element => {
         let deadline = element.value

         if (deadline - Date.now() < 1) {

            element.parentElement.style.border = "1px solid red"

         } else if (deadline - Date.now() <= 59999) {
            
            unit = "secs"
            timer = (deadline - Date.now())/1000

         } else if (deadline - Date.now() <= 3599999) {

            unit = "mins"
            timer = ((deadline - Date.now())/1000)/60

         } else if (deadline - Date.now() <= 86399999) {

            unit = "hrs"
            timer = (((deadline - Date.now())/1000)/60)/60

         } else if (deadline - Date.now() <= 2591999999) {

            unit = "days"
            timer = ((((deadline - Date.now())/1000)/60)/60)/24

         } else if (deadline - Date.now() <= 31535999999) {

            unit = "mths"
            timer = (((((deadline - Date.now())/1000)/60)/60)/24)/30

         } else {

            unit = "yrs"
            timer = (((((deadline - Date.now())/1000)/60)/60)/24)/365

         }

         if (deadline - Date.now() < 1) {
            element.innerHTML = "expired"
         } else {
            element.innerHTML = `${Math.round(timer)} ${unit}`
         }
      
      });

   }

}

function create_toast(header, text) {

   let toastBar = document.getElementById('toast-bar')

   let toastBody = document.createElement('div')
   toastBody.classList.add("toast")

   let toastContent = document.createElement('div')
   toastContent.classList.add("toast-content")

   let toastHeader = document.createElement('p')
   toastHeader.classList.add('toast-header')
   toastHeader.innerHTML = header

   let toastText = document.createElement('p')
   toastText.classList.add('toast-text')
   toastText.innerHTML = text

   let toastClose = document.createElement('div')
   toastClose.classList.add("toast-close")

   let toastButtonImg = document.createElement('img')
   toastButtonImg.classList.add("toast-button-img")
   toastButtonImg.src = "assets/images/confirm_close.png"

   toastBar.appendChild(toastBody)
   toastBody.appendChild(toastContent)
   toastContent.appendChild(toastHeader)
   toastContent.appendChild(toastText)
   toastBody.appendChild(toastClose)
   toastClose.appendChild(toastButtonImg)

   toastBody.classList.add("toast-bounce-animation")

   toastButtonImg.addEventListener('click', function() {

      toastBody.classList.add("toast-delete-animation")

      setTimeout(() => {
         toastBody.remove()
      }, 200);

   })

   setTimeout(() => {

      toastBody.classList.add("toast-delete-animation")

      setTimeout(() => {
         toastBody.remove()
      }, 200);

   }, 10000);

}


function upload() {

   let input = document.getElementById("uploadinput")
   input.click()

}

function download() {

   downloadList = {
      "title": "",
      "checklist": {
      }
   }


   let items = document.querySelectorAll(".item")
   let title = document.getElementById("title")
   console.log(items)

   downloadList.title = title.value

   items.forEach(element => {

      let itemName = element.querySelector(".item-text").innerHTML
      let itemDate = element.querySelector(".item-date").value
      let itemCheck = element.querySelector(".item-check").checked
      
      downloadList.checklist[itemName] = {
            "date": itemDate,
            "checked": itemCheck
      }

   });

   let a = document.createElement('a')
   a.href = URL.createObjectURL(new Blob([JSON.stringify(downloadList)], {type: "application/json"}))
   a.download = `${title.value}`
   a.click()
   
   create_toast("Success!", "Your file has been downloaded.")

}