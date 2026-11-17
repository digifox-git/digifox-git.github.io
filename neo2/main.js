// Need like 10000 different themes for different days!
// (Cat day, Fox day, Pride month/day for 1st of june? My birthday! Also all the seasons. LBP anniversary.
// Anniversary of other games I like)

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