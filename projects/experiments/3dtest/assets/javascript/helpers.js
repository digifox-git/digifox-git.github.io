import soundEffectJSON from "../json/soundeffects.json" with { type: 'json' }

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

export { check_path, play_sound }