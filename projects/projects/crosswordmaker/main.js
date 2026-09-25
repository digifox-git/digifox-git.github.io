// Make cells colorable?? In play and in create mode
// Add all directions for words

let selectedCell
let selectedCoordinates = []
let typeDirection = "across"

function build_table(tableSize) {
    let size = tableSize
    let contentDiv = document.getElementById("content")
    let crosswordMaker = document.getElementById("maker")

    crosswordMaker.innerHTML = ""

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

            // Cell holds letter and is selectable
            cell.addEventListener("click", () => {
                select_cell(i, j)
            })

            cell.addEventListener("dblclick", () => {
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
                event.preventDefault() // Prevent context menu from appearing
                toggle_direction()
            })

            cell.addEventListener("keydown", (event) => {
                if (cell.classList.contains("selected")) {
                    if (event.key.length == 1) {
                        cell.querySelector(".character").innerText = event.key

                        if (event.key == " ") {
                            cell.querySelector(".character").innerText = " "
                        }

                        if (typeDirection == "across") {
                            select_cell(selectedCoordinates[0], selectedCoordinates[1] + 1)
                        }

                        if (typeDirection == "down") {
                            select_cell(selectedCoordinates[0] + 1, selectedCoordinates[1])
                        }
                        
                    }
                    if (event.key == "Backspace") {
                        cell.querySelector(".character").innerText = ""
                        cell.querySelector(".identifier-left").innerText = ""
                        cell.querySelector(".identifier-right").innerText = ""
                        set_attribute("identifier-left", "")
                        set_attribute("identifier-right", "")
                        if (document.getElementById("cell-identifier-left")) {
                            document.getElementById("cell-identifier-left").value = cell.getAttribute("identifier-left")
                        }

                        if (document.getElementById("cell-identifier-right")) {
                            document.getElementById("cell-identifier-right").value = cell.getAttribute("identifier-left")
                        }

                        remove_block(cell)

                        if (typeDirection == "across") {
                            select_cell(selectedCoordinates[0], selectedCoordinates[1] - 1)
                        }

                        if (typeDirection == "down") {
                            select_cell(selectedCoordinates[0] - 1, selectedCoordinates[1])
                        }
                        refresh_words()
                    }

                    if (event.key == "Enter") {
                        toggle_direction()
                    }

                    if (event.key == "ArrowUp") {
                        select_cell(selectedCoordinates[0] - 1, selectedCoordinates[1] )
                    }
                    if (event.key == "ArrowDown") {
                        select_cell(selectedCoordinates[0] + 1, selectedCoordinates[1])
                    }
                    if (event.key == "ArrowLeft") {
                        select_cell(selectedCoordinates[0], selectedCoordinates[1] - 1)
                    }
                    if (event.key == "ArrowRight") {
                        select_cell(selectedCoordinates[0], selectedCoordinates[1] + 1)
                    }

                    if (event.key == "Control") {
                        toggle_block(cell)
                        if (typeDirection == "across") {
                            select_cell(selectedCoordinates[0], selectedCoordinates[1] + 1)
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
    select_cell(0, 0)
}

function toggle_properties(boolean) {
    let properties = document.getElementById("properties-content")
    if (boolean) properties.style.display = "flex"
    else properties.style.display = "none"
}

function set_identifier(identifier, direction) {
    let cells = document.querySelectorAll(".cell")
    
    cells.forEach(element => {
        if (element == selectedCell) {
            if (direction == "left") {
                element.setAttribute("identifier-left", identifier)
                element.querySelectorAll(".identifier-left").forEach(identifier => {
                    identifier.innerText = element.getAttribute("identifier-left")
                })
            } else if (direction == "right") {
                element.setAttribute("identifier-right", identifier)
                element.querySelectorAll(".identifier-right").forEach(identifier => {
                    identifier.innerText = element.getAttribute("identifier-right")
                })
            }
        }
    })
    refresh_cells()
}

// Sets attribute of seleted cell
function set_attribute(attribute, value) {
    let cells = document.querySelectorAll(".cell")
    cells.forEach(element => {
        if (element == selectedCell) {
            element.setAttribute(attribute, value)
        }
    })
    refresh_cells()
}

function refresh_cells() {
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

function refresh_words() {

    let words = document.getElementById("words")
    words.innerHTML = ""

    let maker = document.getElementById("maker")

    let cells = maker.querySelectorAll(".cell")
    
    cells.forEach(cell => {
        if (cell.getAttribute("identifier-left")) {
            let identifier = cell.getAttribute("identifier-left")
            let x = cell.getAttribute("x")
            let y = cell.getAttribute("y")
            let direction = cell.getAttribute("hint-direction-left")
            let hint = cell.getAttribute("hint-left")

            words.innerHTML += `<div class="word" x="${x}" y="${y}">
                                    <p>${identifier}) ${direction}</p>
                                    <div class="word-hint">
                                        <p>${hint}</p>
                                    </div>
                                </div>`
        }
        if (cell.getAttribute("identifier-right")) {
            let identifier = cell.getAttribute("identifier-right")
            let x = cell.getAttribute("x")
            let y = cell.getAttribute("y")
            let direction = cell.getAttribute("hint-direction-right")
            let hint = cell.getAttribute("hint-right")

            words.innerHTML += `<div class="word" x="${x}" y="${y}">
                                    <p>${identifier}) ${direction}</p>
                                    <div class="word-hint">
                                        <p>${hint}</p>
                                    </div>
                                </div>`
        }
    })

    let foundWords = document.querySelectorAll(".word")
    foundWords.forEach(word => {
        word.addEventListener("click", () => {
            let x = Number(word.getAttribute("x"))
            let y = Number(word.getAttribute("y"))
            select_cell(x, y)
        })
    })
}

function toggle_block(cell) {
    if (cell.classList.contains("block")) {
        cell.classList.remove("block")
    } else {
        cell.classList.add("block")
    } 
    refresh_cells()
}

function remove_block(cell) {
    cell.classList.remove("block")
}

function select_cell(x, y) {
    console.log(`Selecting cell (${x}, ${y})`)
    let row = document.querySelector(`[row="${x}"]`)
    let cells = row.childNodes
    cells.forEach(cell => {
        cells.forEach(cell => {
            // console.log(`(${cell.getAttribute("x")}, ${cell.getAttribute("y")})`)
            if (cell.getAttribute("x") == x && cell.getAttribute("y") == y) {
                cell.focus()
                toggle_properties(true)
                document.getElementById("cell-identifier-left").value = cell.getAttribute("identifier-left")
                document.getElementById("cell-identifier-right").value = cell.getAttribute("identifier-right")

                if (document.getElementById("hint-direction-left")) {
                    document.getElementById("hint-direction-left").value = cell.getAttribute("hint-direction-left")
                    document.getElementById("hint-left").value = cell.getAttribute("hint-left")
                }

                if (document.getElementById("hint-direction-right")) {
                    document.getElementById("hint-direction-right").value = cell.getAttribute("hint-direction-right")
                    document.getElementById("hint-right").value = cell.getAttribute("hint-right")
                }
                
                selectedCell = cell
                selectedCoordinates = [x, y]
            }
        })
    })
    let propertyIdentifierLeft = document.getElementById("cell-identifier-left")
    let propertyIdentifierRight = document.getElementById("cell-identifier-right")
    let hintLeft = document.getElementById("cell-hint-left")
    let hintRight = document.getElementById("cell-hint-right")
    if (!propertyIdentifierLeft.value) set_div_display(hintLeft.id, "none")
        else set_div_display(hintLeft.id, "block")
    if (!propertyIdentifierRight.value) set_div_display(hintRight.id, "none")
        else set_div_display(hintRight.id, "block")

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

function set_div_display(id, displayType) {
    let div = document.getElementById(id)
    div.style.display = displayType
}

document.addEventListener("DOMContentLoaded", () => {
    // let createButton = document.getElementById("create")
    //     createButton.addEventListener("click", () => {
    //     build_table(document.getElementById("table-size").value)
    //     docFument.getElementById("properties").remove()
    // })

    // document.addEventListener("click", (event) => {
    //     let table = document.getElementById("maker")
    //     let properties = document.getElementById("properties")

    //     if (!table.contains(event.target) && !properties.contains(event.target)) {
    //         selectedCell = null
    //         toggle_properties(false)
    //         refresh_cells()
    //     }
    // })

    let propertyIdentifierLeft = document.getElementById("cell-identifier-left")
    let directionInputLeft = document.getElementById("hint-direction-left")
    let hintInputLeft = document.getElementById("hint-left")
    propertyIdentifierLeft.addEventListener("change", () => {

        let cells = document.querySelectorAll(".cell")
        let duplicateFound = false
        cells.forEach(cell => {
            if (cell.getAttribute("identifier-left") == propertyIdentifierLeft.value && cell != selectedCell && cell.getAttribute("identifier-left") != "") {
                propertyIdentifierLeft.value = ""
                duplicateFound = true
            }
            if (cell.getAttribute("identifier-right") == propertyIdentifierLeft.value && cell != selectedCell && cell.getAttribute("identifier-right") != "") {
                propertyIdentifierLeft.value = ""
                duplicateFound = true
            }
            if (cell == selectedCell && propertyIdentifierRight.value != "" && propertyIdentifierLeft.value == propertyIdentifierRight.value) {
                propertyIdentifierLeft.value = ""
                duplicateFound = true
            }
        })

        if (duplicateFound) window.alert("Can't have duplicate idendifiers!")

        if (!selectedCell) propertyIdentifierLeft.value = ""
            else if (!duplicateFound) set_identifier(propertyIdentifierLeft.value, "left")

        let hint = document.getElementById("cell-hint-left")


        if (!propertyIdentifierLeft.value) set_div_display(hint.id, "none")
            else if (!duplicateFound) set_div_display(hint.id, "block")
        
        directionInputLeft.value = selectedCell.getAttribute("hint-direction-left")
        hintInputLeft.value = selectedCell.getAttribute("hint-left")
        refresh_words()
    })
    directionInputLeft.addEventListener("input", () => {
        set_attribute("hint-direction-left", directionInputLeft.value)
        refresh_words()
    })
    hintInputLeft.addEventListener("change", () => {
        set_attribute("hint-left", hintInputLeft.value)
        refresh_words()
    })

    let propertyIdentifierRight = document.getElementById("cell-identifier-right")
    let directionInputRight = document.getElementById("hint-direction-right")
    let hintInputRight = document.getElementById("hint-right")
    propertyIdentifierRight.addEventListener("change", () => {

        let cells = document.querySelectorAll(".cell")
        let duplicateFound = false
        cells.forEach(cell => {
            if (cell.getAttribute("identifier-left") == propertyIdentifierRight.value && cell != selectedCell && cell.getAttribute("identifier-left") != "" && selectedCell.getAttribute("identifier-right") != selectedCell.getAttribute("identifier-left")) {
                propertyIdentifierRight.value = ""
                duplicateFound = true
            }
            if (cell.getAttribute("identifier-right") == propertyIdentifierRight.value && cell != selectedCell && cell.getAttribute("identifier-right") != "" && selectedCell.getAttribute("identifier-right") != selectedCell.getAttribute("identifier-left")) {
                propertyIdentifierRight.value = ""
                duplicateFound = true
            }
            if (cell == selectedCell && propertyIdentifierLeft.value != "" && propertyIdentifierRight.value == propertyIdentifierLeft.value) {
                propertyIdentifierRight.value = ""
                duplicateFound = true
            }
        })

        if (duplicateFound) window.alert("Can't have duplicate idendifiers!")

        if (!selectedCell) propertyIdentifierRight.value = ""
            else set_identifier(propertyIdentifierRight.value, "right")

        let hint = document.getElementById("cell-hint-right")

        if (!propertyIdentifierRight.value) set_div_display(hint.id, "none")
            else set_div_display(hint.id, "block")
        
        directionInputRight.value = selectedCell.getAttribute("hint-direction-right")
        hintInputRight.value = selectedCell.getAttribute("hint-right")

        
        refresh_words()
    })
    directionInputRight.addEventListener("change", () => {
        set_attribute("hint-direction-right", directionInputRight.value)
        refresh_words()
    })
    hintInputRight.addEventListener("input", () => {
        set_attribute("hint-right", hintInputRight.value)
        refresh_words()
    })

    toggle_properties(false)
    build_table(15)
})

window.addEventListener("afterprint", () => {
    let crossword = document.getElementById("crossword")
    crossword.innerHTML = ""
})