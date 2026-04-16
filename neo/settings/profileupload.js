function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

document.addEventListener("DOMContentLoaded", function() {

    let uploadButton = document.getElementById("profileedit")

    uploadButton.addEventListener("click", function() {
        show_message('Upload Image', 'Please select a profile picture to upload.', '')
        console.log("success")
    })

})

let imageBase64 = 0

function show_message(header, message, image) {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');
    var elementheader = document.getElementById('notifheader')
    var elementmessage = document.getElementById('notifmessage')
    var root = document.querySelector(':root')
    var rand = Math.floor(Math.random() * (10000 - 1 + 1)) + 1
    console.log(`Generated a random value! Yours was ${rand} out of 10000!.`)

    document.getElementById("uploadpicture").setAttribute("disabled", "true")

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
    
    fileUpload = document.getElementById("fileupload")
    fileUpload.value = ""

    if (document.getElementById("displayImageTemp")) {
        document.getElementById("displayImageTemp").setAttribute("src", "/assets/images/starstorm_blank.png");
    }

    fileUpload.addEventListener('change', function(event) {
        var image = event.currentTarget.files?.[0] // Checks if the input actually contains a file
        if (!image) return;

        const reader = new FileReader();
        reader.onload = () => {
            imageBase64 = reader.result;
            console.log(`Loaded image! Your magic string is: ${imageBase64}`)

            if (document.getElementById("displayImageTemp")) {
                document.getElementById("displayImageTemp").setAttribute("src", "/assets/images/starstorm_blank.png");
            }
            let displayImageTemp = document.getElementById("displayImageTemp")
            displayImageTemp.setAttribute("src", imageBase64)
            document.getElementById("optionalimg").appendChild(displayImageTemp)
            document.getElementById("uploadpicture").removeAttribute("disabled")
        }

        reader.onerror = error => {
            console.error(`Error reading file! Here is it: ${error}`)
        }

        reader.readAsDataURL(image)

    })

}

function handle_upload() {
    if (imageBase64 == null) {
        return;
    } else {
        save_data("user-image", imageBase64)
        console.log('Saved image to "user-image"!')
        hide_message()

        let userImage = localStorage.getItem("user-image")
        if (document.getElementById("profilepicture")) {
            document.getElementById("profilepicture").setAttribute("src", userImage)
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