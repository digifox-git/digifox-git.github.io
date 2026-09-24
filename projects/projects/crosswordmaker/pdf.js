// Duplicate idenfitiers on the same direction causes issues when exporting
// Too many hints cause bad formatting. Maybe make every hint an independent div? So
    // hints in either down or across can keep going onto a second page without bringing
    // the whole category down, too.
// Also, make down/across categories proper column again.

async function build_table(tableSize) {
    let size = tableSize
    let crossword = document.getElementById("crossword")
    let maker = document.getElementById("maker")

    crossword.innerHTML = ""

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

    let downJSON = {}
    let acrossJSON = {}

    crosswordCells.forEach(cell => {
        let hint = ""

        makerCells.forEach(makerCell => {
            let character = makerCell.querySelector(".character")
            let leftID = makerCell.querySelector(".identifier-left")
            let rightID = makerCell.querySelector(".identifier-right")
            let leftHint = makerCell.getAttribute("hint-left")
            let rightHint = makerCell.getAttribute("hint-right")
            let leftDirection = makerCell.getAttribute("hint-direction-left")
            let rightDirection = makerCell.getAttribute("hint-direction-right")
            if (makerCell.getAttribute("x") == cell.getAttribute("x") && makerCell.getAttribute("y") == cell.getAttribute("y")) {
                if (character.innerHTML != "" || leftID.innerHTML != "" || rightID.innerHTML != "") {
                    cell.classList.add("open")
                    cell.querySelector(".identifier-left").innerHTML = leftID.innerHTML
                    cell.setAttribute("identifier-left", leftID.innerHTML)
                    cell.querySelector(".identifier-right").innerHTML = rightID.innerHTML
                    cell.setAttribute("identifier-right", rightID.innerHTML)

                    cell.setAttribute("hint-direction-left", leftDirection)
                    cell.setAttribute("hint-direction-right", rightDirection)

                    cell.setAttribute("hint-left", leftHint)
                    cell.setAttribute("hint-right", rightHint)
                }
                
            }
        })

        if (cell.getAttribute("identifier-left") != "") {
            let identifier = cell.getAttribute("identifier-left")
            let direction = cell.getAttribute("hint-direction-left")
            let hint = cell.getAttribute("hint-left")
            console.log(`${identifier} ${direction}: ${hint}`)

            if (direction == "Down") {
                downJSON[identifier] = hint
            }
            if (direction == "Across") {
                acrossJSON[identifier] = hint
            }
        }

        if (cell.getAttribute("identifier-right") != "") {
            let identifier = cell.getAttribute("identifier-right")
            let direction = cell.getAttribute("hint-direction-right")
            let hint = cell.getAttribute("hint-right")
            console.log(`${identifier} ${direction}: ${hint}`)

            if (direction == "Down") {
                downJSON[identifier] = hint
            }
            if (direction == "Across") {
                acrossJSON[identifier] = hint
            }
        }
    })

    console.log(downJSON)
    console.log(acrossJSON)

    let crosswordTitle = document.getElementById("crossword-title")
    let makerTitle = document.getElementById("title")
    crosswordTitle.innerText = makerTitle.value

    let downList = document.getElementById("down-hints")
    downList.innerHTML = ""
    let acrossList = document.getElementById("across-hints")
    acrossList.innerHTML = ""

    let sortedDownJSON = Object.keys(downJSON)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .reduce((sorted, key) => {
            sorted[key] = downJSON[key]
            return sorted
        }, {})
    let sortedAcrossJSON = Object.keys(acrossJSON)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .reduce((sorted, key) => {
            sorted[key] = acrossJSON[key]
            return sorted
        }, {})

    for (let i = 0; i < Object.keys(sortedDownJSON).length; i++) {
        const identifier = Object.keys(sortedDownJSON)[i];
        const hint = sortedDownJSON[identifier]
        downList.innerHTML += `<p>
            <b>${identifier}</b>. ${hint}
        </p>`
    }

    for (let i = 0; i < Object.keys(sortedAcrossJSON).length; i++) {
        const identifier = Object.keys(sortedAcrossJSON)[i];
        const hint = sortedAcrossJSON[identifier]
        acrossList.innerHTML += `<p>
            <b>${identifier}</b>. ${hint}
        </p>`
    }
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