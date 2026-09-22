let selectedCell
let selectedCoordinates = []
let typeDirection = "across"

function build_table(tableSize) {
    let size = tableSize
    let contentDiv = document.getElementById("content")
    let crosswordMaker = document.getElementById("maker")

    // Creating rows and cells
    for (let i = 0; i < size; i++) {
        let row = document.createElement("tr")
        row.classList.add("row")
        row.setAttribute("row", i)
        crosswordMaker.appendChild(row)

        // console.log(`Adding row ${i}`)
        for (let j = 0; j < size; j++) {
            let cell = document.createElement("td")
            cell.setAttribute("x", i)
            cell.setAttribute("y", j)
            cell.style.height = `${100/size-1}%`
            cell.classList.add("cell")
            cell.tabIndex = 0
            row.appendChild(cell)

            // Cell holds letter and is selectable
            cell.addEventListener("click", () => {
                select_cell(i, j)
            })

            cell.addEventListener("dblclick", () => {
                console.log("Double Clicked")
                if (cell.classList.contains("block")) {
                    cell.classList.remove("block")
                } else {
                    cell.classList.add("block")
                } 
                refresh_cells()
            })

            // Right click
            cell.addEventListener("contextmenu", (event) => {
                if (selectedCell != cell) {
                    return
                }
                console.log(selectedCell)
                console.log(cell)
                event.preventDefault() // Prevent context menu from appearing
                toggle_direction()
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
                        if (typeDirection == "down") {
                            select_cell(selectedCoordinates[0] + 1, selectedCoordinates[1])
                        }
                        
                    }
                    if (event.key == "Backspace") {
                        cell.innerText = ""

                        if (typeDirection == "across") {
                            select_cell(selectedCoordinates[0], selectedCoordinates[1] - 1)
                        }

                        if (typeDirection == "down") {
                            select_cell(selectedCoordinates[0] - 1, selectedCoordinates[1])
                        }
                    }
                }
            })

            // console.log(`Adding cell ${j}`)
        }
    }
}

function refresh_cells() {
    console.log(typeDirection)
    let cells = document.querySelectorAll(".cell")
    
    cells.forEach(element => {
        if (element == selectedCell) {
            element.classList.add("selected")
            if (!element.classList.contains("block")) {
                if (typeDirection == "across") {
                    element.style.setProperty("background-image", "url(across.png)", "important")
                }
                if (typeDirection == "down") {
                    element.style.setProperty("background-image", "url(down.png)", "important")
            }
        } else {
            element.style.backgroundImage = ""
        }
        } else {
            if (typeDirection == "across") {
                element.style.backgroundImage = ""
            }
            if (typeDirection == "down") {
                element.style.backgroundImage = ""
            }
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

function toggle_direction() {
    if (typeDirection == "across") {
        typeDirection = "down" 
        refresh_cells()
        return
    } else {
        typeDirection = "across" 
        refresh_cells()
        return
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let createButton = document.getElementById("create")
        createButton.addEventListener("click", () => {
        build_table(document.getElementById("table-size").value)
        document.getElementById("properties").remove()
    })

    document.addEventListener("click", (event) => {
        let table = document.getElementById("maker")

        if (!table.contains(event.target)) {
            selectedCell = null
            refresh_cells()
        }
    })
})

