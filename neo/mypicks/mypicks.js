import mypicksJSON from './mypicks.json' with { type: 'json' }



document.addEventListener('DOMContentLoaded', () => {
    let friendsList = document.getElementById('friends-list')
    let picksList = document.getElementById('picks-list')

    Object.keys(mypicksJSON.friends).forEach(element => {
        let container = document.createElement('a')
        let websiteImage = document.createElement('div')
        let websiteImageOverlay = document.createElement('div')
        let textContainer = document.createElement('div')
        let title = document.createElement('p')
        let author = document.createElement('p') // Author's name will be the same as the object key name

        container.classList.add('website')
        container.classList.add('friend-website')
        container.href = mypicksJSON.friends[element].href

        container.target = "_blank"

        websiteImage.classList.add('website-badge')
        websiteImage.style.backgroundImage = `url(/neo/assets/badges/friends/${element}.png)`

        websiteImageOverlay.classList.add('badge-overlay')

        textContainer.classList.add('website-text')

        title.classList.add('website-title')
        title.innerText = mypicksJSON.friends[element].name

        author.classList.add('website-credit')
        author.innerText = `By ${element}`

        textContainer.appendChild(title)
        textContainer.appendChild(author)
        websiteImage.appendChild(websiteImageOverlay)
        container.appendChild(websiteImage)
        container.appendChild(textContainer)
        friendsList.appendChild(container)
    });

    Object.keys(mypicksJSON.mypicks).forEach(element => {
        let container = document.createElement('a')
        let websiteImage = document.createElement('div')
        let websiteImageOverlay = document.createElement('div')
        let textContainer = document.createElement('div')
        let title = document.createElement('p')
        let author = document.createElement('p') // Author's name will be the same as the object key name

        let link = mypicksJSON.mypicks[element].link

        container.classList.add('website')
        container.classList.add('pick-website')
        container.href = mypicksJSON.mypicks[element].href

        container.target = "_blank"

        websiteImage.classList.add('website-badge')
        websiteImage.style.backgroundImage = `url(https://icons.duckduckgo.com/ip2/www.${link}.ico)` // Uses DuckDuckGo to easily grab favicon

        websiteImageOverlay.classList.add('badge-overlay')

        textContainer.classList.add('website-text')

        title.classList.add('website-title')
        title.innerText = mypicksJSON.mypicks[element].name

        author.classList.add('website-credit')
        author.innerText = `By ${element}`

        textContainer.appendChild(title)
        textContainer.appendChild(author)
        websiteImage.appendChild(websiteImageOverlay)
        container.appendChild(websiteImage)
        container.appendChild(textContainer)
        picksList.appendChild(container)
    });
})