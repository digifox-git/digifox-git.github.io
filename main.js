let clicksnd = new Audio('/assets/sounds/mouseclick.wav')

window.addEventListener("DOMContentLoaded", function() {

    navbuttons = [
        "navbtn1",
        "navbtn2",
        "navbtn3",
        "navbtn4",
        "navbtn5",
        "navbtn6",
        "navbtn7",
    ]

    navbuttons.forEach(element => {
        button = document.getElementById(element)

        if (button) {
            if (!button.classList.contains("selectedtravelbutton")) {
                button.addEventListener("mouseover", function() {
                    let snd = new Audio(`/assets/sounds/navbtn/${element}.wav`)
                    snd.load()
                    snd.play()
                })
            }
        }
    });

    document.querySelectorAll('[role=tablist]').forEach( element => {
        element.addEventListener("mousedown", function() {
            clicksnd.load()
            clicksnd.play()
        })
    })
})

function travel_to(destination) {
    window.location.href = destination
}

function tab(tab) {
    let tabs = document.querySelectorAll('[role="tab"]')
    let panels = document.querySelectorAll('[role="tabpanel"]')

    tabs.forEach(tab => tab.setAttribute("aria-selected", "false"))
    document.getElementById(`tab-${tab}`).setAttribute("aria-selected", "true")

    panels.forEach(panel => panel.setAttribute("hidden", "true"))
    document.getElementById(`panel-${tab}`).removeAttribute("hidden")
}

function background(path) {
    console.log(path)
    document.getElementById("content").style.setProperty("background-image", path)
}

function generate_topbar() {
    
}