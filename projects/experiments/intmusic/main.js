document.addEventListener("DOMContentLoaded", async function() {
    // Create audio context stuffs
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain()
    const startTime = 0

    async function load(url) {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        return await audioContext.decodeAudioData(arrayBuffer)
    }

    // HTML elements that control volume of audio and which audio should play
    let intModeSlider = document.getElementById("int_mode")
    let intModeVolumeSlider = document.getElementById("int_mode_vol")
    let ambientVolumeSlider = document.getElementById("ambient")
    let baseVolumeSlider = document.getElementById("int_base")

    // Header for mode changer
    let modeHeader = document.getElementById("mode_header")
    
    function update_int_music() {
        switch (intModeSlider.value) {
            case "0":
                earth_gain.gain.value = intModeVolumeSlider.value/10
                moon_gain.gain.value = 0
                info_gain.gain.value = 0
                modeHeader.innerHTML = "Earth"
            break
            case "1":
                earth_gain.gain.value = 0
                moon_gain.gain.value = intModeVolumeSlider.value/10
                info_gain.gain.value = 0
                modeHeader.innerHTML = "Moon"
            break
            case "2":
                earth_gain.gain.value = 0
                moon_gain.gain.value = 0
                info_gain.gain.value = intModeVolumeSlider.value/10
                modeHeader.innerHTML = "Info"
            break
        }
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

    base_buffer.start(startTime)
    earth_buffer.start(startTime)
    moon_buffer.start(startTime)
    info_buffer.start(startTime)
    ambient_buffer.start(startTime)

    update_int_music()
    
    intModeSlider.addEventListener("change", function() {
        update_int_music()
    })

    intModeVolumeSlider.addEventListener("change", function() {
        update_int_music()
    })

    ambientVolumeSlider.addEventListener("change", function() {
        ambient_gain.gain.value = ambientVolumeSlider.value/10
    })

    baseVolumeSlider.addEventListener("change", function() {
        base_gain.gain.value = baseVolumeSlider.value/10
    })
    
})