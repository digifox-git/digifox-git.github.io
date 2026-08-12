import soundEffectJSON from "../json/soundeffects.json" with { type: 'json' }
import { create_pause_button } from "./pause.js"

async function check_path(path) {
    try {
        const response = await fetch(path)
        return response.ok
    } catch {
        return false
    }
}

function play_sound(sound, volume=1) {
    console.log(soundEffectJSON[`${sound}`])
    let soundEffect = new Audio(soundEffectJSON[`${sound}`])
    soundEffect.volume = volume
    soundEffect.play()
}

function fade_in() {
    let loadingScreen = document.getElementById("loading")
    loadingScreen.classList.add("fade_loading")
    loadingScreen.addEventListener("animationend", () => {
        create_pause_button()
    })
}

export { check_path, play_sound, fade_in }