document.addEventListener("DOMContentLoaded", function() {
    let random = Math.floor(Math.random() * 50)
    console.log(random)
    console.log(history.go(1))

    if (random == 0) {
        window.location.replace("/man")
    }
})