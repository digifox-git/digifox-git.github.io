document.addEventListener("DOMContentLoaded", () => {
    let destinations = document.querySelectorAll(".destination")
    destinations.forEach(destination => {
        destination.addEventListener("click", () => {
            let tabs = document.querySelectorAll(".tab")
            tabs.forEach(tab => {
                if (tab.getAttribute("tab") != destination.id) tab.classList.add("hidden")
                else tab.classList.remove("hidden")
            })
        })
    })
})