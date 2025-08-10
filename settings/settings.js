function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

document.addEventListener("DOMContentLoaded", function() {

    let loadingProgress = 100
    let progressBar = document.getElementById("progressbar")
    let progressContainer = document.getElementById("progresscontainer")
    let settings = document.getElementById("settingscontent")

    progressBar.style.setProperty("width", `${loadingProgress}%`) 

    let generateFun = Math.floor(Math.random() * (100 - 1 + 1)) + 1

    if (localStorage.getItem("fun-value") === null) {
        save_data("fun-value", `${generateFun}`)
    }

    // Handles the user-hide-epilepsy-warnings preference
    if (localStorage.getItem("user-hide-epilepsy-warnings") == null) {
        save_data("user-hide-epilepsy-warnings", false)
    }

    let settingepilepsy = document.getElementById("settingepilepsy")
    let checkEpilepsyPreference = localStorage.getItem("user-hide-epilepsy-warnings")

    if (checkEpilepsyPreference == "true") {
        settingepilepsy.checked = (checkEpilepsyPreference === "true")
    }

    settingepilepsy.addEventListener("change", () => {
        if (settingepilepsy.checked) {
            localStorage.setItem("user-hide-epilepsy-warnings", "true")
        } else {
            localStorage.setItem("user-hide-epilepsy-warnings", "false")
        }
    })

    // Handles the user-search-background preference
    let searchBackgroundPreference = localStorage.getItem("user-search-background")
    if (document.getElementById("settingsearchbackground")) {
        document.getElementById("settingsearchbackground").innerHTML = `Search Background: "${searchBackgroundPreference}"`
        console.log(`Profile: Loaded user-search-background`)
    }

    // Handles the user-name input
    let userName = localStorage.getItem("user-name")
    if (document.getElementById("settingentername") && localStorage.getItem("user-name")) {
        document.getElementById("settingentername").value = userName
        document.getElementById("displayname").innerHTML = userName
        console.log(`Profile: Loaded user-name`)
    }

    // Handles the fun-value display
    let funValue = localStorage.getItem("fun-value")
    if (document.getElementById("settingfunvalue")) {
        document.getElementById("settingfunvalue").innerHTML = `Fun Value: ${funValue}`
        console.log(`Profile: Loaded fun-value`)
    }

    // Handles user image display
    let userImage = localStorage.getItem("user-image")
    if (document.getElementById("profilepicture") && userImage != null) {
        document.getElementById("profilepicture").setAttribute("src", userImage)
        console.log(`Profile: Loaded user-image`)
    } else {
        document.getElementById("profilepicture").setAttribute("src", "/assets/images/profile_empty.png")
    }

    settings.removeAttribute("Hidden")
    progressContainer.remove()

    load_storage()
})

// Function for setting or updating the user's preferred name
function set_name() {
    let username = document.getElementById("settingentername").value
    save_data("user-name", username)
    console.log(`Profile: set user-name to ${username}!`)
}

function reset_profile() {
    localStorage.clear();
    window.location.href = "/index.html"
}

function load_storage() {

    let inventory = document.getElementById("inventorylist")

    for(let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith("inventory")) {
            let value = localStorage.getItem(key);
            console.log(`Profile: loaded item ${key} x${value}`)

            let itemContainer = document.createElement("div")
            itemContainer.classList.add("item")

            let item = document.createElement("p")
            item.innerHTML = `${key.substring(10)} ( ${value} )`

            let path = `/assets/images/inventory/${key}.png`
            let defaultPath = `/assets/images/inventory/inventory-default.png`
            let image = document.createElement("img")
            image.src = path
            
            inventory.appendChild(itemContainer)
            itemContainer.appendChild(image)
            itemContainer.appendChild(item)

            image.addEventListener('error', function handleError() {
                image.src = defaultPath
            })
        }
    }
}

function check_file(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.onload = function() {
        callback(xhr.status !== 404);
    }
    xhr.onerror = function() {
        callback();
    }
    xhr.send
}