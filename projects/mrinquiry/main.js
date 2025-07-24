var successAudio = new Audio('https://digifox.space/projects/mrinquiry/websuccess.mp3')
successAudio.load()
successAudio.volume=0.5
var errorAudio = new Audio('https://digifox.space/projects/mrinquiry/webnotice.mp3')
errorAudio.load()
errorAudio.volume=0.5
var publishAudio = new Audio('https://digifox.space/projects/mrinquiry/webpublish.mp3')
publishAudio.load()
publishAudio.volume=0.5


function show_message(type, header, message, image) {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');
    var elementheader = document.getElementById('notifheader')
    var elementmessage = document.getElementById('notifmessage')
    var root = document.querySelector(':root')
    var rand = Math.floor(Math.random() * (10000 - 1 + 1)) + 1
    console.log(`Generated a random value! Yours was ${rand} out of 10000!.`)

    if (rand == 66) {
        window.location.replace('tab/w.html')
    }

    if (type == 'success') {
        successAudio.currentTime = 0;
        successAudio.play()
        root.style.setProperty('--hue', '300deg')
    }

    if (type == 'error') {
        errorAudio.currentTime = 0;
        errorAudio.play()
        root.style.setProperty('--hue', '160deg')
    }

    if (type == 'publish') {
        publishAudio.currentTime = 0;
        publishAudio.play()
        root.style.setProperty('--hue', '20deg')
    }

    if (type == 'creepy') {
        publishAudio.currentTime = 0;
        publishAudio.play()
        root.style.setProperty('--hue', '150deg')
    }

    if (type == 'basic') {
        publishAudio.currentTime = 0;
        successAudio.play()
        root.style.setProperty('--hue', '0deg')
    }

    if(element.style.display == 'none' ||element.style.display == '') {
        element.style.display = 'flex';
        elementcontainer.style.display = 'flex';
        elementheader.innerHTML = header
        elementmessage.innerHTML = message
        if (image != '' || image != null) {
            let imgDiv = document.getElementById('optionalimg')
            let notifImage = document.createElement("img")
            notifImage.src = image
            notifImage.id = "notifimage"
            imgDiv.appendChild(notifImage)

        }
    }

}

function hide_message() {
    var element = document.getElementById('notification');
    var elementcontainer = document.getElementById('notificationcontainer');
    let hasImage = document.getElementById("notifimage")

    if(element.style.display == 'flex') {
        element.style.display = 'none';
        elementcontainer.style.display = 'none';
        hasImage.remove();
    }
}

function download_standalone() {
    window.location.href = 'https://digifox.space/Resources/DOWNLOAD/TROPIC.zip'
}

function request(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true); // false for synchronos request
    xmlHttp.send(null)
    console.log(xmlHttp.responseText)
    return xmlHttp.responseText
}

document.addEventListener('DOMContentLoaded', function () {
    let snd_move = new Audio("https://digifox.space/projects/mrinquiry/webhover.mp3");
    snd_move.volume = 0.5;
    snd_move.load()

    async function movesnd() {
    snd_move.currentTime = 0
    snd_move.play();
    console.log('played')
    }

    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("mouseenter", movesnd);

});

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("mouseenter", movesnd);
});
});