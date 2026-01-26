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

// Sidebar
//-----------------------------------------------------------------------------------------//

let siteVersion = "3.0.0"
let siteTheme = "default"

if (siteTheme == "default") {
    document.documentElement.style.setProperty('--primary-hue', '#4e0dff');
    document.documentElement.style.setProperty('--secondary-hue', '#7b71ff')
    document.documentElement.style.setProperty('--sidebar-bg', 'url(/assets/images/blue074.jpg)');
} else if (siteTheme == "autumn") {
    document.documentElement.style.setProperty('--primary-hue', '#cc5425');
    document.documentElement.style.setProperty('--secondary-hue', '#ff9e71')
    document.documentElement.style.setProperty('--sidebar-bg', 'url(/assets/images/leafground.jpg)');
} else if (siteTheme == "winter") {
    document.documentElement.style.setProperty('--primary-hue', '#BA2323');
    document.documentElement.style.setProperty('--sidebar-bg', 'url(/assets/images/mistletoe.gif)');
    document.documentElement.style.setProperty('--bg-size', '5vw');
};

// Stop audio from inconsistently playing by keeping audioContext loaded
let audioContext = new AudioContext();
// MUST CHANGE THESE TO WEBSITE URL!
addSFX("sbHover", "http://127.0.0.1:5501/assets/sounds/pagehover2.wav", 4)
addSFX("sbSelect", "http://127.0.0.1:5501/assets/sounds/softclick.wav", 1)

addSFX("pageHome", "http://127.0.0.1:5501/assets/sounds/door_close.wav", 1)
addSFX("pageYou", "http://127.0.0.1:5501/assets/sounds/okdesuka.wav", 1)

if ( audioContext.state === 'suspended') {
    audioContext.resume();
}

window.addEventListener("DOMContentLoaded", () => {

    playSFX("sbSelect")

    create_sidebar()

    let sidebarHidden = false;

    let sidebar = document.getElementById("sidebar");
    let sidebarTab = document.getElementById("show-hide");

    if (sidebarTab) {
        sidebarTab.addEventListener("click", function() {
        sidebarHidden = !sidebarHidden;
        console.log(sidebarHidden);

        if (sidebarHidden == false) {
            sidebar.classList.add("show-sidebar");
            sidebar.classList.remove("hide-sidebar");
        };
        if (sidebarHidden == true) {
            sidebar.classList.add("hide-sidebar");
            sidebar.classList.remove("show-sidebar");
        };
    });
    }
});

function create_sidebar() {
    let sidebar = document.getElementById("sidebar");
    let dropShadowWrap = document.createElement("div");
    let sideBranding = document.createElement("div");
    let sideLogo = document.createElement("img");
    let sideVersion = document.createElement("p");
    let sideButtons = document.createElement("p");

    dropShadowWrap.classList.add("drop-shadow-wrap");

    sideBranding.classList.add("side-branding");

    sideLogo.classList.add("side-logo");
    sideLogo.src = "/assets/images/logo_clean.png";

    sideVersion.classList.add("side-version");
    sideVersion.innerText = `v${siteVersion}`;

    sideButtons.classList.add("side-buttons")
    sideButtonsClass = document.getElementsByClassName("side-button")

    sidebar.appendChild(dropShadowWrap);
    dropShadowWrap.appendChild(sideBranding);
    sideBranding.appendChild(sideLogo);
    sideBranding.appendChild(sideVersion);

    sidebar.appendChild(sideButtons)
    sideButtons.appendChild(create_sidebutton("Home", "/neo/"))
    sideButtons.appendChild(create_sidebutton("About Me", "/neo/"))
    sideButtons.appendChild(create_sidebutton("Projects", "/neo/"))
    sideButtons.appendChild(create_sidebutton("Experiments", "/neo/"))
    sideButtons.appendChild(create_sidebutton("Gallery", "/neo/"))
    sideButtons.appendChild(create_sidebutton("Resources", "/neo/"))
    sideButtons.appendChild(create_sidebutton("Cool Pages", "/neo/mypicks"))
    sideButtons.appendChild(create_sidebutton("Guestbook", "/neo/"))
    sideButtons.appendChild(create_sidebutton("Archive", "/neo/archive"))
    sideButtons.appendChild(create_sidebutton("You", "/neo/settings"))
};

function create_sidebutton(name, destination) {
    let sideButton = document.createElement("button");
    sideButton.innerText = name;
    
    // Determine if button should be unselectable based on <meta> tag in current loaded page
    if (document.querySelector('meta[name="pagename"]').content == name) {
        sideButton.classList.add("side-button-nosel")
    } else {
        sideButton.classList.add("side-button")
        sideButton.onclick = function() {travel(destination)};
        // sideButton.onmouseover = function() {
            // playSFX("sbHover")
        // }
    }

    return sideButton;
};

function travel(destination) {
    window.location.href = destination;
};