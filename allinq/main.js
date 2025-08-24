window.addEventListener("DOMContentLoaded", function() {

    let noty = this.document.getElementById("noty")
    let numberOfTheYear = 44

    let leftBox = this.document.getElementById("leftbox")

    noty.addEventListener("mousedown", function() {
        noty.innerHTML = numberOfTheYear

        let newty = document.createElement('h1')
        newty.innerHTML = numberOfTheYear
        newty.classList.add("bigglowly")
        leftBox.appendChild(newty)
    })

    setInterval(() => {
        let randnoty = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1
        noty.innerHTML = randnoty
    }, 10);

    
})