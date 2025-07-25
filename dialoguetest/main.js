var txtsnd = new Audio('https://digifox.space/Resources/sounds/snd_txt.wav')
txtsnd.load()

function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

var i = 0
var textInterval = 30

function dialogue_builder(dialogue) {

    var txt = dialogue

    if (i < txt.length) {
        document.getElementById("dialoguetext").innerHTML += txt.charAt(i);
        txtsnd.play()
        i++;
        setTimeout(() => dialogue_builder(dialogue), textInterval);
    }
}