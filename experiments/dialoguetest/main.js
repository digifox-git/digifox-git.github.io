var txtsnd = new Audio('https://digifox.space/Resources/sounds/snd_text.ogg')
txtsnd.load()

function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

window.onload = function() {
   update_resetcolor() 
}

function reset_dialoguetest() {

    let snd_shatter = new Audio("https://digifox.space/Resources/sounds/snd_break2.ogg")
    let snd_hit = new Audio("https://digifox.space/Resources/sounds/snd_hit.ogg")
    snd_shatter.load()
    snd_hit.load()
    snd_hit.volume = 0.8

    if (localStorage.getItem("flag-testdialogue-wasmean") || localStorage.getItem("inventory-hasaudio")) {
        localStorage.removeItem("flag-testdialogue-wasmean")
        localStorage.removeItem("inventory-hasaudio")
        snd_shatter.play()
    } else {
        snd_hit.play()
    }
}

function update_resetcolor() {

    if (localStorage.getItem("flag-testdialogue-wasmean") || localStorage.getItem("inventory-hasaudio")) {
        document.getElementById("resetbutton").style.setProperty("color", "red")
        document.getElementById("resetbutton").style.setProperty("border", "8px red solid")
    } else {
        document.getElementById("resetbutton").style.setProperty("color", "#b20000")
        document.getElementById("resetbutton").style.setProperty("border", "8px #b20000 solid")
    }
    setTimeout(update_resetcolor, 200)
}