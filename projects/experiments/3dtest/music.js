// Create audio context stuffs
const audioContext = new AudioContext();
const gainNode = audioContext.createGain()
const startTime = 0

async function load(url) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return await audioContext.decodeAudioData(arrayBuffer)
}

// Loads all interactive music
let mus_ambient = await load("assets/ambient.ogg")
let mus_int_base = await load("assets/int_base.ogg")
let mus_int_earth = await load("assets/int_earth.ogg")
let mus_int_moon = await load("assets/int_moon.ogg")
let mus_int_info = await load("assets/int_info.ogg")

// Put all music on a shared buffer for simultaneous playback
let base_buffer = audioContext.createBufferSource()
let base_gain = audioContext.createGain()
base_buffer.buffer = mus_int_base
base_buffer.loop = true

let earth_buffer = audioContext.createBufferSource()
let earth_gain = audioContext.createGain()
earth_buffer.buffer = mus_int_earth
earth_buffer.loop = true

let moon_buffer = audioContext.createBufferSource()
let moon_gain = audioContext.createGain()
moon_buffer.buffer = mus_int_moon
moon_buffer.loop = true

let info_buffer = audioContext.createBufferSource()
let info_gain = audioContext.createGain()
info_buffer.buffer = mus_int_info
info_buffer.loop = true

let ambient_buffer = audioContext.createBufferSource()
let ambient_gain = audioContext.createGain()
ambient_buffer.buffer = mus_ambient
ambient_buffer.loop = true

// Connect gain node to buffer sources and connect sources to audioContext
base_buffer.connect(base_gain).connect(audioContext.destination)
earth_buffer.connect(earth_gain).connect(audioContext.destination)
moon_buffer.connect(moon_gain).connect(audioContext.destination)
info_buffer.connect(info_gain).connect(audioContext.destination)
ambient_buffer.connect(ambient_gain).connect(audioContext.destination)

function start_tracks() {
    base_buffer.start(startTime)
    earth_buffer.start(startTime)
    moon_buffer.start(startTime)
    info_buffer.start(startTime)
    ambient_buffer.start(startTime)
}

earth_gain.gain.value = 0
moon_gain.gain.value = 0
info_gain.gain.value = 0

function update_int_music(track) {
    let currentTime = audioContext.currentTime
    earth_gain.gain.cancelScheduledValues(currentTime)
    moon_gain.gain.cancelScheduledValues(currentTime)

    earth_gain.gain.setValueAtTime(earth_gain.gain.value, currentTime)
    moon_gain.gain.setValueAtTime(moon_gain.gain.value, currentTime)
    switch (track) {
        case "base":
            earth_gain.gain.linearRampToValueAtTime(0, currentTime + 1)
            moon_gain.gain.linearRampToValueAtTime(0, currentTime + 1)
        break
        case "earth":
            earth_gain.gain.linearRampToValueAtTime(1, currentTime + 1)
            moon_gain.gain.linearRampToValueAtTime(0, currentTime + 1)
        break
        case "moon":
            earth_gain.gain.linearRampToValueAtTime(0, currentTime + 1)
            moon_gain.gain.linearRampToValueAtTime(1, currentTime + 1)
        break
    }
}

export { update_int_music, start_tracks }