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

// \u200E = Pause
// \n = Start new line
// \n\u00A0 = Wrap to next line

// Array that contains all dialogue
let dialogue = {
    dialoguetestpage_check: [
        "= flag-testdialogue-wasmean,true",
        "< dialoguetestpage_3",
        "= flag-testdialogue-wasmean,false",
        "< dialoguetestpage_0",
    ],  
    dialoguetestpage_0: [
        "* Oh!\u200E Hello there.\u200E\n* Welcome to the dialogue test\n\u00A0 room.",
        "* Sorry about the mess,\u200E I wasn't\n\u00A0 expecting visitors so soon!",
        "* How does this make you feel?",
        "> dialoguetestpage_0_choicer"
    ],
    dialoguetestpage_0_choicer: [
        "This\nmakes me\nfeel good",
        "> dialoguetestpage_1",
        "This\nmakes me\nfeel bad",
        "> dialoguetestpage_2",
    ],
    dialoguetestpage_1: [
        "$ flag-testdialogue-wasmean,false",
        "* Hah!\u200E I'm glad.",
        "* Well,\u200E that is all.\u200E\n* Goodbye, friend!"
    ],
    dialoguetestpage_2: [
        "$ flag-testdialogue-wasmean,true",
        "* Oh,\u200E oh,\u200E what a shame...",
        "* Well,\u200E don't bother coming back\n\u00A0\u00A0then.\u200E\n* Goodbye!"
    ],
    dialoguetestpage_3: [
        "* No,\u200E no,\u200E I've had my fill of\n\u00A0 you.",
    ],
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
    dialogueContainer.style.setProperty("z-index", "99")

    let dialogueBox = document.createElement('div')
    dialogueBox.setAttribute("id", "dialogueBox") 
    dialogueBox.style.setProperty("display", "flex")
    dialogueBox.style.setProperty("position", "fixed")
    dialogueBox.style.setProperty("bottom", "32px")
    dialogueBox.style.setProperty("width", "840px")
    dialogueBox.style.setProperty("height", "216px")
    dialogueBox.style.setProperty("border", "8px white solid")
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
    let choicerContainer = document.createElement('div')
    choicerContainer.setAttribute("id", "choicerContainer") 
    choicerContainer.style.setProperty("display", "flex")
    choicerContainer.style.setProperty("justify-content", "center")
    choicerContainer.style.setProperty("position", "fixed")
    choicerContainer.style.setProperty("bottom", "0px")
    choicerContainer.style.setProperty("width", "100%")
    choicerContainer.style.setProperty("z-index", "101")

    let choicerBox = document.createElement('div')
    choicerBox.setAttribute("id", "choicerBox") 
    choicerBox.style.setProperty("display", "flex")
    choicerBox.style.setProperty("position", "fixed")
    choicerBox.style.setProperty("bottom", "32px")
    choicerBox.style.setProperty("width", "840px")
    choicerBox.style.setProperty("height", "216px")
    choicerBox.style.setProperty("border", "8px white solid")
    choicerBox.style.setProperty("color", "white")
    choicerBox.style.setProperty("background-color", "black")
    choicerBox.style.setProperty("font-family", "determination")

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
    choicerA.style.setProperty("text-align", "center")

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
    choicerB.style.setProperty("text-align", "center")

    let choicerSoul = document.createElement('img')
    choicerSoul.setAttribute("id", "choicerSoul")
    choicerSoul.src = '/Resources/soul_choicer.png'
    choicerSoul.style.setProperty("position", "fixed")
    choicerSoul.style.setProperty("bottom", "136px")
    choicerSoul.style.setProperty("left", "580px")

    document.body.append(choicerContainer)
    document.getElementById("choicerContainer").appendChild(choicerBox)      
    document.getElementById("choicerBox").appendChild(choicerSoul)  
    document.getElementById("choicerBox").appendChild(choicerA)
    document.getElementById("choicerBox").appendChild(choicerB)
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
            disableControls.style.setProperty("z-index", "100")

            document.body.append(disableControls)

            document.getElementById('disableControls').addEventListener("click", function() {
                if (document.getElementById('dialogueBox')) {
                    progress_dialogue()
                }
            });

    }
}

function enable_controls() {
    let disableControls = document.getElementById("disableControls");
    disableControls.remove();
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

        
        } 

        // > Forwards you to a choicer
        if (txt.charAt(0) == ">") {
            let jumpToChoicer = txt.substring(2)
            console.log(`Activating Choicer ${jumpToChoicer}`)
            choicer_builder(jumpToChoicer)
            destroy_dialogue_box()

        // < Forwards you to a dialogue
        } else if (txt.charAt(0) == "<") {
            let jumpToChoicer = txt.substring(2)
            console.log(`Activating Dialogue ${jumpToChoicer}`)
            destroy_dialogue_box()
            dialogue_builder(jumpToChoicer)

        // $ Saves Data
        } else if (txt.charAt(0) == "$") {
            let saveData = txt.substring(2)
            let saveStorage = saveData.split(",")[0]
            let saveValue = saveData.split(",")[1]
            console.log(`Saving Data ${saveData}`)
            save_data(saveStorage, saveValue)
            progress_dialogue()
            progress_dialogue()

        // = Checks a Storage Value         
        } else if (txt.charAt(0) == "=") {
            let loadData = txt.substring(2)
            let loadStorage = loadData.split(",")[0]
            let loadValue = loadData.split(",")[1]
            console.log(`Checking if ${loadData}`)
            if (localStorage.getItem(loadStorage) == loadValue) {
                console.log(`Check returned true!`)
                progress_dialogue()
                progress_dialogue()

            } else {
                console.log(`Check returned false!`)
                currentDialogue += 2
                progress_dialogue()
                progress_dialogue()
            }
            
        }

    }
}

function choicer_builder(conversation) {

    if (!document.getElementById('choicerBox')) {

        create_choicer()
        disable_controls()

        document.getElementById("choicerA").innerHTML = dialogue[conversation][0];
        document.getElementById("choicerB").innerHTML = dialogue[conversation][2];

        document.getElementById('choicerA').addEventListener("mouseover", function() {
            let choicerSoul = document.getElementById("choicerSoul")
            choicerSoul.style.setProperty("bottom", "136px")
            choicerSoul.style.setProperty("left", "580px")
        });

        document.getElementById('choicerB').addEventListener("mouseover", function() {
            let choicerSoul = document.getElementById("choicerSoul")
            choicerSoul.style.setProperty("bottom", "136px")
            choicerSoul.style.setProperty("left", "960px")
        });

        document.getElementById('choicerA').addEventListener("click", function() {
            let jumpTo = dialogue[conversation][1].substring(2)
            console.log(jumpTo)
            destroy_choicer_box()
            dialogue_builder(jumpTo)
        });

        document.getElementById('choicerB').addEventListener("click", function() {
            let jumpTo = dialogue[conversation][3].substring(2)
            console.log(`${jumpTo}`)
            destroy_choicer_box()
            dialogue_builder(jumpTo)
        });
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
        enable_controls()
    }
}

// Destroy all elements related to the dialogue box
function destroy_dialogue_box() {
    let dialogueContainer = document.getElementById("dialogueContainer");
    let dialogueBox = document.getElementById("dialogueBox");
    let dialogueText = document.getElementById("dialogueText");
    dialogueContainer.remove();
    dialogueBox.remove();
    dialogueText.remove();
    i = 0
    currentDialogue = 0
}

// Destroy all elements related to the choicer box
function destroy_choicer_box() {
    let choicerContainer = document.getElementById("choicerContainer");
    let choicerBox = document.getElementById("choicerBox");
    let choicerA = document.getElementById("choicerA");
    let choicerB = document.getElementById("choicerB");
    choicerContainer.remove();
    choicerBox.remove();
    choicerA.remove();
    choicerB.remove();
    i = 0
    currentDialogue = 0
}
