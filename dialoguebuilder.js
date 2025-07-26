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

addSFX("snd_text", "https://digifox.space/Resources/sounds/snd_text.ogg", 4)
addSFX("snd_init", "https://digifox.space/Resources/sounds/initializer.ogg", 1)
playSFX("snd_init")

// Save data to local
function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

// Array that contains all dialogue
let dialogue = {
    dialoguetestpage_0: [
        "* Hello!\u200E You have entered the\n\u00A0\u00A0dialogue test page.\n* Extra line.",
        "* I,\u200E can.\u200E Do!\u200E Any:\u200E\n\u00A0\u00A0Punctuation????????????????????\n\u00A0\u00A0?????????????????",
        "* How does this make you feel?",
        "* ...",
        "* Hah!\u200E If only you could\n\u00A0\u00A0answer...",
        "* This will be a feature one day.\u200E\n* I hope you will come back\n\u00A0\u00A0later!",
        "! 'good'(dialoguetestpage_1)|'bad'(dialoguetestpage_2)"
    ],
}

// Unused for now
let dialogueFlags = {
    "dialoguetestpage_0": {
        "completed": false
    }
}

var i = 0 // Iterator
var textInterval = 30 // Speed of text tying in milliseconds
var currentDialogue = 0 

function create_dialogue() {
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

function create_choicer() {
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

    let choicerA = document.createElement('p')
    choicerA.setAttribute("id", "choicerA")
    choicerA.style.setProperty("margin", "2%")
    choicerA.style.setProperty("margin-left", "3%")
    choicerA.style.setProperty("line-height", "150%")
    choicerA.style.setProperty("width", "50%")
    choicerA.style.setProperty("height", "80%")
    choicerA.style.setProperty("font-size", "40px")
    choicerA.style.setProperty("white-space", "pre-line")
    choicerA.style.setProperty("user-select", "none")
    let choicerB = document.createElement('p')
    choicerB.setAttribute("id", "choicerB")
    choicerB.style.setProperty("margin", "2%")
    choicerB.style.setProperty("margin-left", "3%")
    choicerB.style.setProperty("line-height", "150%")
    choicerB.style.setProperty("width", "50%")
    choicerB.style.setProperty("height", "80%")
    choicerB.style.setProperty("font-size", "40px")
    choicerB.style.setProperty("white-space", "pre-line")
    choicerB.style.setProperty("user-select", "none")

    document.body.append(dialogueContainer)
    document.getElementById("dialogueContainer").appendChild(dialogueBox)        
    document.getElementById("dialogueBox").appendChild(choicerA)
    document.getElementById("dialogueBox").appendChild(choicerB)
}

function disable_controls() {

    //Create an invisible element that covers the screen. Prevents interacting with web page and allows the user to progress dialogue
    if (!document.getElementById('disableControls')) {
            var disableControls = document.createElement('div')
            disableControls.setAttribute("id", "disableControls")
            disableControls.style.setProperty("position", "absolute")
            disableControls.style.setProperty("width", "100%")
            disableControls.style.setProperty("height", "100%") 
            disableControls.style.setProperty("top", "0")

            document.body.append(disableControls)

            document.getElementById('disableControls').addEventListener("click", function() {
                progress_dialogue()
            });
    }
}

function dialogue_builder(conversation) {

    // Increase conversation variable scope to global
    globalThis.conversation = conversation

    // Create all dialogue box elements
    if (!document.getElementById('dialogueBox')) {

        create_dialogue()

    }

    // Get current dialogue progress and disable web page interaction
    txt = dialogue[conversation][currentDialogue]
    disable_controls()

    // Type text one character at a time until the string is finished
    if (i < txt.length) {

        // * Denotes text
        if (txt.charAt(0) == "*") {
            document.getElementById("dialogueText").innerHTML += txt.charAt(i);

            // Play sound unless the iterator is on a blank character
            if (txt.charAt(i) != " ") {
                    playSFX("snd_text");
            }

            // Change speed if iterator is on a special unicode character
            if (txt.charAt(i) == "\u200E") {
                    textInterval = 240
            } else {
                    textInterval = 30
            }

            //Iterate and type next character
            i++;
            setTimeout(() => dialogue_builder(conversation), textInterval);

        // ! Denotes an action
        } else if (txt.charAt(0) == "!") {
            destroy_dialogue_box()
            choicer_builder()
        }
    

    }
}

function choicer_builder() {
    if (!document.getElementById('dialogueBox')) {

        create_dialogue()

    }
}

function progress_dialogue() {

    // Get current dialogue progress
    var txt = dialogue[conversation][currentDialogue]

    // Skip to the end of dialogue
    if (i < txt.length) {
        document.getElementById("dialogueText").innerHTML = txt;
        i = txt.length
        return;
    }

    // If the dialogue was already complete, advance to the next string
    currentDialogue++
    
    // If current dialogue progress is less than the total length of conversation, continue. Otherwise, destroy the dialogue box
    if (currentDialogue < dialogue[conversation].length) {
        document.getElementById("dialogueText").innerHTML = "";
        i = 0
        dialogue_builder(conversation)
    } else {
        destroy_dialogue_box()
    }
}

// Destroy all elements related to the dialogue box
function destroy_dialogue_box() {
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
