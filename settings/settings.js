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
    }

    // Handles the user-name input
    let userName = localStorage.getItem("user-name")
    if (document.getElementById("settingentername") && localStorage.getItem("user-name")) {
        document.getElementById("settingentername").value = userName
        document.getElementById("displayname").innerHTML = userName
    }

    // Handles the fun-value display
    let funValue = localStorage.getItem("fun-value")
    if (document.getElementById("settingfunvalue")) {
        document.getElementById("settingfunvalue").innerHTML = `Fun Value: ${funValue}`
    }

    settings.removeAttribute("Hidden")
    progressContainer.remove()

})

// Function for setting or updating the user's preferred name
function set_name() {
    let username = document.getElementById("settingentername").value
    save_data("user-name", username)
    console.log(`Set new name to ${username}!`)
}

function reset_profile() {
    localStorage.clear();
    window.location.href = "https://digifox.space"
}

function to_base64(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
