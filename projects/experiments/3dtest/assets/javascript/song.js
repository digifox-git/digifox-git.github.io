// Create audio context stuffs
const audioContext = new AudioContext();
const gainNode = audioContext.createGain()
const startTime = 0

async function play_song(url) {
    async function load(url) {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        return await audioContext.decodeAudioData(arrayBuffer)
    }
    let song = await load(url)

    let song_buffer = audioContext.createBufferSource()
    song_buffer.buffer = song
    song_buffer.loop = true

    let song_gain = audioContext.createGain()

    song_buffer.connect(song_gain).connect(audioContext.destination)

    song_buffer.start(startTime)
}

export { play_song }