function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

window.onload = function() {

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
    let userName = localStorage.getItem("user-name")
    if (document.getElementById("settingentername") && localStorage.getItem("user-name")) {
        document.getElementById("settingentername").value = userName
    }

    // Handles the user-search-background preference
    let searchBackgroundPreference = localStorage.getItem("user-search-background")
    if (document.getElementById("settingsearchbackground")) {
        document.getElementById("settingsearchbackground").innerHTML = `Search Background: "${searchBackgroundPreference}"`
    }

    // Handles the fun-value display
    let funValue = localStorage.getItem("fun-value")
    if (document.getElementById("settingfunvalue")) {
        document.getElementById("settingfunvalue").innerHTML = `Fun Value: ${funValue}`
    }

    if (document.getElementById("loadingbar")) {
        document.getElementById("loadingbar").remove()
        document.getElementById("settingscontent").style.setProperty("display", "inline")
    }
}

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