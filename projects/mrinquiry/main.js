var successAudio = new Audio('websuccess.mp3')
successAudio.load()
var errorAudio = new Audio('webnotice.mp3')
errorAudio.load()
var publishAudio = new Audio('webpublish.mp3')
publishAudio.load()

function success() {
    successAudio.load()
    successAudio.play()
}
function error() {
    errorAudio.load()
    errorAudio.play()
}
function publish() {
    publishAudio.load()
    publishAudio.play()
}

function show_message(type, header, message) {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');
    var elementheader = document.getElementById('notifheader')
    var elementmessage = document.getElementById('notifmessage')
    var root = document.querySelector(':root')



    if (type == 'success') {
        successAudio.load()
        successAudio.play()
        root.style.setProperty('--hue', '280deg')
    }

    if (type == 'error') {
        errorAudio.load()
        errorAudio.play()
        root.style.setProperty('--hue', '160deg')
    }

    if (type == 'publish') {
        publishAudio.load()
        publishAudio.play()
        root.style.setProperty('--hue', '20deg')
    }

    if(element.style.display == 'none' ||element.style.display == '') {
        element.style.display = 'flex';
        elementcontainer.style.display = 'flex';
        elementheader.innerHTML = header
        elementmessage.innerHTML = message
    }

}

function hide_message() {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');

    if(element.style.display == 'flex') {
        element.style.display = 'none';
        elementcontainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let snd_move = new Audio("webhover.mp3");
    snd_move.volume = 0.5;

    async function movesnd() {
    snd_move.load();
    snd_move.play();
    }

    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("mouseenter", movesnd);

});

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("mouseenter", movesnd);
});
});