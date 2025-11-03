hourlyJSON = {
    0: {
        "totalSamples": 1481636,
        "sampleRate": 32728,
        "loopStart": 372736
    },
    1: {
        "totalSamples": 1890091,
        "sampleRate": 32728,
        "loopStart": 14336
    },
    2: {
        "totalSamples": 2773005,
        "sampleRate": 32728,
        "loopStart": 43008
    },
    3: {
        "totalSamples": 1357844,
        "sampleRate": 32728,
        "loopStart": 14336
    },
    4: {
        "totalSamples": 2129419,
        "sampleRate": 32728,
        "loopStart": 415744
    },
    5: {
        "totalSamples": 1781647,
        "sampleRate": 32728,
        "loopStart": 14336
    },
    6: {
        "totalSamples": 1334663,
        "sampleRate": 32728,
        "loopStart": 114688
    },
    7: {
        "totalSamples": 1647688,
        "sampleRate": 32728,
        "loopStart": 186368
    },
    8: {
        "totalSamples": 1442573,
        "sampleRate": 32728,
        "loopStart": 28672
    },
    9: {
        "totalSamples": 985573,
        "sampleRate": 32728,
        "loopStart": 43008
    },
    10: {
        "totalSamples": 0,
        "sampleRate": 32728,
        "loopStart": 0
    },
    11: {
        "totalSamples": 1446257,
        "sampleRate": 32728,
        "loopStart": 71680
    },
    12: {
        "totalSamples": 1574663,
        "sampleRate": 32728,
        "loopStart": 172032
    },
    13: {
        "totalSamples": 1552834,
        "sampleRate": 32728,
        "loopStart": 243712
    },
    14: {
        "totalSamples": 1688542,
        "sampleRate": 32728,
        "loopStart": 301056
    },
    15: {
        "totalSamples": 996227,
        "sampleRate": 32728,
        "loopStart": 14336
    },
    16: {
        "totalSamples": 1573113,
        "sampleRate": 32728,
        "loopStart": 100352
    },
    17: {
        "totalSamples": 2515315,
        "sampleRate": 32728,
        "loopStart": 329728
    },
    18: {
        "totalSamples": 1496201,
        "sampleRate": 32728,
        "loopStart": 28672
    },
    19: {
        "totalSamples": 1629817,
        "sampleRate": 32728,
        "loopStart": 243712
    },
    20: {
        "totalSamples": 1452217,
        "sampleRate": 32728,
        "loopStart": 86016
    },
    21: {
        "totalSamples": 1769134,
        "sampleRate": 32728,
        "loopStart": 372736
    },
    22: {
        "totalSamples": 1244317,
        "sampleRate": 32728,
        "loopStart": 43008
    },
    23: {
        "totalSamples": 2059296,
        "sampleRate": 32728,
        "loopStart": 28672
    },
}

document.addEventListener('DOMContentLoaded', function() {

    loading_end()
    
    let d = new Date()
    let currentHour = d.getHours()

    var music = new Howl({ // Initial track setup, plays song based on currentHour. will be destroyed on new hour
        src: [`music/${currentHour}.ogg`],
        html5: false,
        loop: false,
        onend: function() {
            music.seek(hourlyJSON[currentHour].loopStart/hourlyJSON[currentHour].sampleRate) // Find the loop point in seconds (Loop Starting Sample Timestamp/Sample Rate)
            music.play()
        }
    });

    setTimeout(() => {
        music.play() // Play initial track after short delay
    }, 1500);
    
    const weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    let timeDisplay = document.getElementById("time")
    let monthDisplay = document.getElementById("month")
    let dateDisplay = document.getElementById("date")
    let dayDisplay = document.getElementById("day")
    

    setInterval(() => { // Check every second for clock update and current hour
        let d = new Date()
        let currentTime = d.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
        let currentDay = weekday[d.getDay()]
        let currentMonth = d.getMonth() + 1
        let currentDate = d.getDate()
        currentHour = d.getHours() // Set currentHour to the current hour. Genoius!

        timeDisplay.innerHTML = currentTime
        monthDisplay.innerHTML = currentMonth
        dateDisplay.innerHTML = currentDate
        dayDisplay.innerHTML = currentDay

        console.log(currentHour)

        if (d.getMinutes() == 59 && d.getSeconds() == 50) {
            next_track()
        }
    }, 1000);

    function next_track() {

        music.fade(1, 0, 10000) // Fade out current track

        setTimeout(() => { // Create a new track and destroy previous (12 second delay to account for fade out)
            music.unload() // Unload previous music

            music = new Howl({ // Use Howler.js for better audio looping with minimal stutter
                src: [`music/${currentHour}.ogg`],
                html5: false,
                loop: false,
                onend: function() { // Return to loop point after song ends
                    music.seek(hourlyJSON[currentHour].loopStart/hourlyJSON[currentHour].sampleRate) // Find the loop point in seconds (Loop Starting Sample Timestamp/Sample Rate)
                    music.play()
                }
            });

            music.play() // Play song after initialized
        }, 12000);

    }

    function loading_end() {
        let loadBackground = document.getElementById("loading-overlay")

    setTimeout(() => {
        loadBackground.classList.add("load-out")
        loadBackground.classList.remove("load-in")
    }, 1000);
    }

})