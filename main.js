function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

window.onload = function() {

    let generateFun = Math.floor(Math.random() * (100 - 1 + 1)) + 1

    if (localStorage.getItem("fun-value") === null) {
        save_data("fun-value", `${generateFun}`)
    }
}