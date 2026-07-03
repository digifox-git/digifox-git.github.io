import levelsJSON from '../../levels/levels.json' with { type: 'json' }

let open_pause = new Audio("../../assets/audio/start_menu_open_01.wav")
open_pause.volume = 0.4
let close_pause = new Audio("../../assets/audio/start_menu_close_01.wav")
close_pause.volume = 0.4
let pod_move = new Audio('../../assets/pod_cursor_move.wav')
pod_move.volume = 0.5
let pod_select = new Audio('../../assets/pod_select.wav')
pod_select.volume = 0.5
let pod_error = new Audio('../../assets/pod_error_01.wav')
pod_error.volume = 0.3
let leave_level = new Audio('../../assets/audio/re-enter_pod_01.wav')
leave_level.volume = 0.5

function play_sound(name) {
    name.pause()
    name.currentTime = 0
    name.play()
}

function create_pause_button() {
    const container = document.createElement("div")
    const image = document.createElement("img")

    container.id = "pause_button"
    container.style.position = "absolute"
    container.style.top = "1vh"
    container.style.left = "0.5vw"
    container.style.userSelect = "none"

    image.src = "../../assets/images/pause_button.svg"
    image.style.width = "4vw"

    container.appendChild(image)
    document.body.appendChild(container)

    container.addEventListener("mouseenter", () => {
        container.style.scale = 1.1
        container.style.cursor = "pointer"
        play_sound(pod_move)
    })
    container.addEventListener("mouseleave", () => {
        container.style.scale = 1
    })
    container.addEventListener("click", () => {
        play_sound(open_pause)
        toggle_pause(true)
    })
}

function toggle_pause_button(bool) {
    let pauseButton = document.getElementById("pause_button")
    if (bool == true) {
        pauseButton.style.display = "block"
    } else {
        pauseButton.style.display = "none"
    }
}

function exit_level() {
    let input_capture = document.getElementById("input_capture")
    input_capture.classList.add("unpause")
    input_capture.classList.remove("pause")
    const fade = document.createElement('div')
    fade.id = "fade"
    document.body.appendChild(fade)
    fade.addEventListener("animationend", () => {
        location.href = "../../index.html?level=test"
    })
}

function toggle_pause(bool) {
    const inputCapture = document.createElement("div")
    inputCapture.id = "input_capture"

    const quitButton = document.createElement("div")
    quitButton.id = "quit_button"
    quitButton.classList.add("pausebutton")

    quitButton.style.display = "flex"
    quitButton.style.width = "25vw"
    quitButton.style.height = "15vh"
    quitButton.style.justifyContent = "center"
    quitButton.style.alignItems = "center"
    quitButton.style.userSelect = "none"

    const quitText = document.createElement("p")
    quitText.innerHTML = "Return to Home"

    const quitImg = document.createElement("div")

    quitButton.appendChild(quitImg)
    quitButton.appendChild(quitText)

    const unpauseButton = document.createElement("div")
    unpauseButton.id = "unpause_button"
    unpauseButton.classList.add("pausebutton")

    const unpauseText = document.createElement("p")
    unpauseText.innerHTML = "Continue"

    const unpauseImg = document.createElement("div")

    unpauseButton.appendChild(unpauseImg)
    unpauseButton.appendChild(unpauseText)

    quitButton.addEventListener("mouseenter", () => {
        play_sound(pod_move)
    })

    quitButton.addEventListener("click", () => {
        play_sound(leave_level)
        play_sound(close_pause)
        exit_level()
    })

    unpauseButton.addEventListener("mouseenter", () => {
        play_sound(pod_move)
    })

    unpauseButton.addEventListener("click", () => {
        toggle_pause(false)
        play_sound(close_pause)
    })

    inputCapture.appendChild(unpauseButton)
    inputCapture.appendChild(quitButton)

    if (bool == true) {
        toggle_pause_button(false)
        document.body.appendChild(inputCapture)
        document.getElementById("input_capture").classList.add("pause")
        document.getElementById("input_capture").classList.remove("unpause")
    } else {
        toggle_pause_button(true)
        document.getElementById("input_capture").classList.add("unpause")
        document.getElementById("input_capture").classList.remove("pause")
        document.getElementById("input_capture").addEventListener("animationend", () => {
            document.body.removeChild(document.getElementById("input_capture"))
        })
    }
}

export { create_pause_button }