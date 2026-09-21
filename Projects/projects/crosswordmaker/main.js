let rows = 15
let columns = 15
let selectedCell
let selectedCoordinates = []
let typeDirection = "across"

function refresh_cells() {
    let cells = document.querySelectorAll(".cell")
    cells.forEach(element => {
        if (element == selectedCell) {
            element.classList.add("selected")
        } else {
            element.classList.remove("selected")
        }

        if (element.innerText != "") {
            element.classList.add("filled")
        } else {
            element.classList.remove("filled")
        }
    })
}

function select_cell(x, y) {
    console.log(x)
    console.log(y)
    let row = document.querySelector(`[row="${x}"]`)
    let cells = row.childNodes
    cells.forEach(cell => {
        cells.forEach(cell => {
            // console.log(`(${cell.getAttribute("x")}, ${cell.getAttribute("y")})`)
            if (cell.getAttribute("x") == x && cell.getAttribute("y") == y) {
                cell.focus()
                selectedCell = cell
                selectedCoordinates = [x, y]
            }
        })
    })
    console.log(selectedCoordinates)
    refresh_cells()
}

document.addEventListener("DOMContentLoaded", () => {
    let contentDiv = document.getElementById("content")

    // Creating table
    let crosswordMaker = document.getElementById("maker")

    // Creating rows and cells
    for (let i = 0; i < columns; i++) {
        let row = document.createElement("tr")
        row.classList.add("row")
        row.setAttribute("row", i)
        crosswordMaker.appendChild(row)

        console.log(`Adding row ${i}`)
        for (let j = 0; j < rows; j++) {
            let cell = document.createElement("td")
            cell.setAttribute("x", i)
            cell.setAttribute("y", j)
            cell.style.height = `${100/columns-1}%`
            cell.classList.add("cell")
            cell.tabIndex = 0
            row.appendChild(cell)

            // Cell holds letter and is selectable
            cell.addEventListener("click", () => {
                select_cell(i, j)
                console.log(selectedCell)
            })

            cell.addEventListener("dblclick", () => {
                console.log("Double Clicked")
                if (cell.classList.contains("block")) {
                    cell.classList.remove("block")
                } else {
                    cell.classList.add("block")
                } 
            })

            cell.addEventListener("keydown", (event) => {
                if (cell.classList.contains("selected")) {
                    if (event.key.length == 1) {
                        console.log(event.key)
                        cell.innerText = event.key

                        if (event.key == " ") {
                            cell.innerText = " "
                        }

                        if (typeDirection == "across") {
                            select_cell(selectedCoordinates[0], selectedCoordinates[1] + 1)
                        }
                        
                    }
                    if (event.key == "Backspace") {
                        cell.innerText = ""

                        if (typeDirection == "across") {
                            select_cell(selectedCoordinates[0], selectedCoordinates[1] - 1)
                        }
                    }
                }
            })

            console.log(`Adding cell ${j}`)
        }

        document.addEventListener("click", (event) => {
            let table = document.getElementById("maker")
            selectedCell = null

            if (!table.contains(event.target)) {
                refresh_cells()
            }
        })
    }
})

