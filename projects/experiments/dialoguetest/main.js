var txtsnd = new Audio('https://digifox.space/Resources/sounds/snd_text.ogg')
txtsnd.load()

function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

window.addEventListener("DOMContentLoaded", function() {
   update_resetcolor() 
})

function reset_dialoguetest() {

    let snd_shatter = new Audio("https://digifox.space/assets/sounds/snd_break2.ogg")
    let snd_hit = new Audio("https://digifox.space/assets/sounds/snd_hit.ogg")
    snd_shatter.load()
    snd_hit.load()
    snd_hit.volume = 0.6
    snd_shatter.volume = 0.6

    if (localStorage.getItem("flag-testdialogue-wasmean") || localStorage.getItem("inventory-audio")) {
        localStorage.removeItem("flag-testdialogue-wasmean")
        localStorage.removeItem("inventory-audio")
        snd_shatter.play()
    } else {
        snd_hit.play()
    }
}

function update_resetcolor() {

    if (localStorage.getItem("flag-testdialogue-wasmean") || localStorage.getItem("inventory-audio")) {
        document.getElementById("resetbutton").style.setProperty("color", "red")
    } else {
        document.getElementById("resetbutton").style.setProperty("color", "#b20000")
    }
    setTimeout(update_resetcolor, 200)
}

const shakingLetters = document.querySelectorAll('.shake');
const maxShake = 3

