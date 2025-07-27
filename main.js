function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

window.onload = function() {

    let generateFun = Math.floor(Math.random() * (100 - 1 + 1)) + 1

    if (localStorage.getItem("fun-value") === null) {
        save_data("fun-value", `${generateFun}`)
    }

    let settingepilepsy = document.getElementById("settingepilepsy")
    settingepilepsy.addEventListener('change', function() {

        // Handles the user-hide-epilepsy-warnings preference
        if (localStorage.getItem("user-hide-epilepsy-warnings") === null) {
            save_data("user-hide-epilepsy-warnings", false)
        }

        if (localStorage.getItem("user-hide-epilepsy-warnings") === true) {
            document.getElementById("settingepilepsy").check
            return;
        }

        if (document.getElementById("settingepilepsy").checked) {
            save_data("user-hide-epilepsy-warnings", true)
            console.log("set user-hide-epilepsy-warnings to true")
        } else {
            save_data("user-hide-epilepsy-warnings", false)
            console.log("set user-hide-epilepsy-warnings to false")
        }
    })

    // Handles the user-search-background preference
    let userName = localStorage.getItem("user-name")
    if (document.getElementById("settingentername") && localStorage.getItem("user-name")) {
        document.getElementById("settingentername").value = `${userName}`
    }

    // Handles the user-search-background preference
    let searchBackgroundPreference = localStorage.getItem("user-search-background")
    if (document.getElementById("settingsearchbackground")) {
        document.getElementById("settingsearchbackground").innerHTML = `Search Background: "${searchBackgroundPreference}"`
    }

    // Handles the user-search-background preference
    let funValue = localStorage.getItem("fun-value")
    if (document.getElementById("settingfunvalue")) {
        document.getElementById("settingfunvalue").innerHTML = `Fun Value: ${funValue}`
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