var txtsnd = new Audio('https://digifox.space/Resources/sounds/snd_text.ogg')
txtsnd.load()

function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

function reset_dialoguetest() {
    if (localStorage.getItem("flag-testdialogue-wasmean")) {
        localStorage.removeItem("flag-testdialogue-wasmean")
    }
    if (localStorage.getItem("inventory-hasaudio")) {
        localStorage.removeItem("inventory-hasaudio")
    }
}