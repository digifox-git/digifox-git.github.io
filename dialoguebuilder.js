// Overlapping Audio
//-----------------------------------------------------------------------------------------//

/*
* Author: Chad Cromwell
* Date: Jun 1, 2019
*/

let pSFX = true; //Whether or not sound effects SHOULD be played.
let sfx = []; //Holds all sound effects

//addSFX(key, pathToAudioFile, number) function - Accepts a key for easy array lookup, path to the audio file, and number of times you want this audio file to be able to overlap.
function addSFX(key, pathToAudioFile, number) {
    for(let i = 0; i < number; i++) {
        sfx.push({key: [key], audio: new Audio(pathToAudioFile)}); //Load sound effect and push to sfx array with passed key
    }
}

//playSFX(key) function - Accepts a key and plays the corresponding sound effect if it is available from the SFX pool
function playSFX(key) {
    //If sound effects aren't muted
    if(pSFX) {
        let max = sfx.length; //Get length of sound effect pool
        //Iterate through all sound effects in the passed key pool
        for(let i = 0; i < max; i++) {
            //If the sound effect isn't being played
            if(sfx[i].key == key && sfx[i].audio.paused) {
                let sfxPlayPromise = sfx[i].audio.play(); //Create promise
                //If the file is loaded
                if(sfxPlayPromise !== undefined) {
                    //Then, play the sound effect
                    sfxPlayPromise.then(_ => {
                        sfx[i].audio.play();
                    }).catch(error => { //Else, it's not loaded yet
                       console.log("audio not yet loaded");
                    });
                }
                break; //Break out of loop because we've just played the sound effect
            }
        }
    }
}

// Dialogue Builder
//-----------------------------------------------------------------------------------------//

addSFX("snd_text", "https://digifox.space/Resources/sounds/snd_text.ogg", 16)
addSFX("snd_init", "https://digifox.space/Resources/sounds/initializer.ogg", 16)
playSFX("snd_init")

function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

let dialogue = {
    "dialoguetestpage_0": {
        "0": "* Hello! You have entered the\n\u00A0\u00A0dialogue test page.\n* Extra line.",
        "1": "* How does this make you feel?",
        "2": "* ...",
        "3": "* Hah! If only you could\n\u00A0\u00A0answer...",
        "4": "* This will be a feature one day.\n* I hope you will come back\n\u00A0\u00A0later!",
        "total": 4
    },
    "dialoguetestpage_0_choicer": {
        "0": "I feel good",
        "1": "I feel not good",
        "total": 1
    }  
}

let dialogueFlags = {
    "dialoguetestpage_0": {
        "completed": false
    }
}

var i = 0
var textInterval = 35
var currentDialogue = 0

function disable_controls() {
    if (!document.getElementById('disableControls')) {
            var disableControls = document.createElement('div')
            disableControls.setAttribute("id", "disableControls")
            disableControls.style.setProperty("position", "absolute")
            disableControls.style.setProperty("width", "100%")
            disableControls.style.setProperty("height", "100%") 
            disableControls.style.setProperty("top", "0")

            document.body.append(disableControls)

            document.getElementById('disableControls').addEventListener("click", function() {
                complete_dialogue()
            });
    }
}

function dialogue_builder(conversation) {

    globalThis.conversation = conversation

    if (!document.getElementById('dialogueBox')) {

        let dialogueContainer = document.createElement('div')
        dialogueContainer.setAttribute("id", "dialogueContainer") 
        dialogueContainer.style.setProperty("display", "flex")
        dialogueContainer.style.setProperty("justify-content", "center")
        dialogueContainer.style.setProperty("position", "fixed")
        dialogueContainer.style.setProperty("bottom", "0px")
        dialogueContainer.style.setProperty("width", "100%")

        let dialogueBox = document.createElement('div')
        dialogueBox.setAttribute("id", "dialogueBox") 
        dialogueBox.style.setProperty("display", "flex")
        dialogueBox.style.setProperty("position", "fixed")
        dialogueBox.style.setProperty("bottom", "32px")
        dialogueBox.style.setProperty("width", "840px")
        dialogueBox.style.setProperty("height", "216px")
        dialogueBox.style.setProperty("border", "6px white solid")
        dialogueBox.style.setProperty("color", "white")
        dialogueBox.style.setProperty("background-color", "black")
        dialogueBox.style.setProperty("font-family", "determination")

        let dialogueText = document.createElement('p')
        dialogueText.setAttribute("id", "dialogueText")
        dialogueText.style.setProperty("margin", "2%")
        dialogueText.style.setProperty("margin-left", "3%")
        dialogueText.style.setProperty("line-height", "150%")
        dialogueText.style.setProperty("width", "100%")
        dialogueText.style.setProperty("height", "80%")
        dialogueText.style.setProperty("font-size", "40px")
        dialogueText.style.setProperty("white-space", "pre-line")
        dialogueText.style.setProperty("user-select", "none")

        document.body.append(dialogueContainer)
        document.getElementById("dialogueContainer").appendChild(dialogueBox)        
        document.getElementById("dialogueBox").appendChild(dialogueText)
    }

    var txt = dialogue[conversation][currentDialogue.toString()]
    disable_controls()

    if (i < txt.length) {
        document.getElementById("dialogueText").innerHTML += txt.charAt(i);
        console.log(`currentDialogue is ${currentDialogue}, but dialogue[conversation].length is ${dialogue[conversation].total}!`)
        if (txt.charAt(i) != " ") {
            playSFX("snd_text");
        }

        i++;
        setTimeout(() => dialogue_builder(conversation), textInterval);
    }
}

function complete_dialogue() {

    var txt = dialogue[conversation][currentDialogue.toString()]

    if (i < txt.length) {
        document.getElementById("dialogueText").innerHTML = txt;
        i = txt.length
    } else if (i+1 >= txt.length && currentDialogue != dialogue[conversation].total) {
        document.getElementById("dialogueText").innerHTML = "";
        currentDialogue += 1
        i = 0
        dialogue_builder(conversation)
    } else {
        let disableControls = document.getElementById("disableControls");
        let dialogueContainer = document.getElementById("dialogueContainer");
        let dialogueBox = document.getElementById("dialogueBox");
        let dialogueText = document.getElementById("dialogueText");
        disableControls.remove();
        dialogueContainer.remove();
        dialogueBox.remove();
        dialogueText.remove();
        i = 0
        currentDialogue = 0
    }
} 