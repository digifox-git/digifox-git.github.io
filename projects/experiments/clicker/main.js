function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

document.addEventListener("DOMContentLoaded", function() {

    let buttonCount = 0
    let displayCount = document.getElementById("displaycount")
    let button = document.getElementById("button");

    if (localStorage.getItem("inventory-button")) {
        buttonCount = localStorage.getItem("inventory-button")
        displayCount.innerHTML = buttonCount
    }


    button.addEventListener("click", function() {
        buttonCount++
        save_data("inventory-button", buttonCount)

        displayCount.innerHTML = buttonCount
        button.style.animation="none"
        setTimeout(function() {
            button.style.animation="bounce 0.25s ease 0s 1 normal"
        }, 10)
    })

    button.addEventListener("animationend", function() {
        button.style.animation="none"
    })

})