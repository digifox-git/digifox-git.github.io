document.addEventListener('DOMContentLoaded', () => {
    let button = document.getElementById("cardbutton")

    let cards;
    get_data()

    button.addEventListener('click', () => {
        fetch_card()
    })

    async function get_data() {
        let data = await fetch('pool/freddy-fazbears-pizza.json')
        cards = await data.json()
    }

    async function fetch_card() {
        let cardTitle = document.getElementById("cardtitle")
        let cardImage = document.getElementById("cardimage")
        let loadingCard = document.getElementById("loadingcard")
        loadingCard.style.display = "block"
        cardImage.src = ""
        cardImage.onload = null

        let randomChoice = Math.floor(Math.random() * cards.length)

        let card = cards[randomChoice]
        let urlCardTitle = encodeURIComponent(card) // Makes title URL-friendly

        let url = `https://vsbattles.fandom.com/api.php?action=query&titles=${urlCardTitle}&prop=pageimages&format=json&pithumbsize=500&origin=*` // Get thumbnail of each page
        const request = await fetch(url)
        const result = await request.json()

        const page = Object.values(result.query.pages)[0]
        let thumbnail;
        console.log(page)
        console.log(page.title)
        
        if (page.thumbnail?.source) { // Check if thumbnail exists
            thumbnail = page.thumbnail.source
            cardImage.src = thumbnail
            console.log(thumbnail)
            cardImage.onload = () => {
                cardTitle.innerText = page.title
                loadingCard.style.display = "none"
            }
        } else {
            thumbnail = "https://digifox.neocities.org/assets/naturaldeadleaves.gif"
            cardImage.src = thumbnail
            cardTitle.innerText = page.title
            loadingCard.style.display = "none"
        }
    }
})