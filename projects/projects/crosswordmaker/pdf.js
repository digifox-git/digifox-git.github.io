async function build_table(tableSize) {
    let size = tableSize
    let contentDiv = document.getElementById("export")
    let crossword = document.getElementById("crossword")
    let maker = document.getElementById("maker")

    // Creating rows and cells
    for (let i = 0; i < size; i++) {
        let row = document.createElement("tr")
        row.classList.add("row")
        row.setAttribute("row", i)
        crossword.appendChild(row)

        // console.log(`Adding row ${i}`)
        for (let j = 0; j < size; j++) {
            let cell = document.createElement("td")
            cell.setAttribute("x", i)
            cell.setAttribute("y", j)
            cell.setAttribute("identifier-left", "")
            cell.setAttribute("identifier-right", "")
            cell.setAttribute("hint-direction-left", "")
            cell.setAttribute("hint-direction-right", "")
            cell.setAttribute("hint-left", "")
            cell.setAttribute("hint-right", "")
            cell.style.height = `${100/size-1}%`
            cell.classList.add("cell")
            cell.tabIndex = 0

            let character = document.createElement("p")
            character.classList.add("character")

            let identifierLeft = document.createElement("p")
            identifierLeft.classList.add("identifier-left")
            let identifierRight = document.createElement("p")
            identifierRight.classList.add("identifier-right")

            cell.appendChild(character)
            cell.appendChild(identifierLeft)
            cell.appendChild(identifierRight)
            row.appendChild(cell)
        }
    }

    let crosswordCells = crossword.querySelectorAll('.cell')
    let makerCells = maker.querySelectorAll('.cell')

    crosswordCells.forEach(cell => {
        makerCells.forEach(makerCell => {
            let character = makerCell.querySelector(".character")
            let leftID = makerCell.querySelector(".identifier-left")
            let rightID = makerCell.querySelector(".identifier-right")
            if (makerCell.getAttribute("x") == cell.getAttribute("x") && makerCell.getAttribute("y") == cell.getAttribute("y")) {
                if (character.innerHTML != "" || leftID.innerHTML != "" || rightID.innerHTML != "") {
                    cell.classList.add("open")
                    cell.querySelector(".identifier-left").innerHTML = leftID.innerHTML
                    cell.querySelector(".identifier-right").innerHTML = rightID.innerHTML
                }
                
            }
        })
    })

    contentDiv.appendChild(crossword)
}

document.addEventListener("DOMContentLoaded", () => {
    let exportButton = document.getElementById("export-button")
    let exportDiv = document.getElementById("export")

    exportButton.addEventListener("click", async () => {
        exportDiv.style.display = "block"
        await build_table(15)
        window.print()
        exportDiv.style.display = "none"
    })
})