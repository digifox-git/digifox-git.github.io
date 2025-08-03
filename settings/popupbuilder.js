document.addEventListener("DOMContentLoaded", function() {

    let uploadButton = document.getElementById("profilepicture")

    uploadButton.addEventListener("click", function() {
        show_message('Upload Image', 'Please select a profile picture to upload.', '')
        console.log("success")
    })

})


function show_message(header, message, image) {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');
    var elementheader = document.getElementById('notifheader')
    var elementmessage = document.getElementById('notifmessage')
    var root = document.querySelector(':root')
    var rand = Math.floor(Math.random() * (10000 - 1 + 1)) + 1
    console.log(`Generated a random value! Yours was ${rand} out of 10000!.`)

    if(element.style.display == 'none' ||element.style.display == '') {
        element.style.display = 'flex';
        elementcontainer.style.display = 'flex';
        elementheader.innerHTML = header
        elementmessage.innerHTML = message
        if (image != '' || image != null) {
            let imgDiv = document.getElementById('optionalimg')
            let notifImage = document.createElement("img")
            notifImage.src = image
            notifImage.id = "notifimage"
            imgDiv.appendChild(notifImage)

        }
    }

}

function hide_message() {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');
    let hasImage = document.getElementById("notifimage")

    if(element.style.display == 'flex') {
        element.style.display = 'none';
        elementcontainer.style.display = 'none';
        hasImage.remove();
    }
}