import newsJSON from './assets/news.json' with { type: 'json' }

let newsReel = document.getElementById("news_bar")
let newsReelText = document.getElementById("news_reel_text")
let newsReelMarquee = document.getElementById("news_reel_marquee")
let currentNews = 0

newsReelText.innerHTML = `(Updated ${newsJSON[currentNews].date}) ${newsJSON[currentNews].content}`
console.log("Loaded News Marquee")

newsReelMarquee.classList.add('marquee')

function toggle_news(bool) {
    if (bool == true) {
        newsReel.style.display = "flex"
        newsReel.classList.remove("news_outro")
        newsReel.classList.add("news_intro")
    } else {
        newsReel.classList.remove("news_intro")
        newsReel.classList.add("news_outro")
        newsReel.addEventListener("animationend", () => {
            if (newsReel.querySelector(".news_outro")) {
                newsReel.style.display = "none"
            }
        })
    }
}

toggle_news(false)

export { toggle_news }