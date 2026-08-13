document.addEventListener("DOMContentLoaded", () => {

    let updateButton = document.getElementById("update_kubejs_button")
    let consoleLogger = document.getElementById("console_log")
    updateButton.addEventListener("click", () => {
        consoleLogger.classList.remove("pop")
        console.log("Updating!")
        update_kubejs()
    })

    async function update_kubejs() {

        updateButton.classList.add("waiting")

        document.getElementById("content").style.background = "linear-gradient(315deg,rgb(31, 31, 31) 0%, rgb(65, 65, 65) 100%)"
        updateButton.innerText = "Please Wait..."

        let authKey = ""
        authKey = document.getElementById("update_kubejs_auth").value

        let request = await fetch(`https://gitman.digifox.space/updategit`, {
            method: "GET",
            "headers": {
                Authorization: `${authKey}`
            },
        })  

        let res = await request.json();
        console.log(res)
        console.log(res.content)
        console.log(res.status)

        consoleLogger.classList.add("pop")

        switch (res.status) {
            case 200:
                updateButton.classList.remove("waiting")
                updateButton.innerText = "Updated KubeJS Successfully!"
                document.getElementById("content").style.background = "linear-gradient(315deg,rgb(12, 7, 41) 0%, rgb(26, 14, 79) 100%)"
            break
            case 400:
                updateButton.innerText = "Error!"
                updateButton.classList.remove("waiting")
                document.getElementById("content").style.background = "linear-gradient(315deg,rgba(41, 7, 7, 1) 0%, rgba(79, 14, 14, 1) 100%)"
            break
            case 401:
                updateButton.innerText = "Error!"
                updateButton.classList.remove("waiting")
                document.getElementById("content").style.background = "linear-gradient(315deg,rgba(41, 7, 7, 1) 0%, rgba(79, 14, 14, 1) 100%)"
            break
        }
        consoleLogger.innerText = res.content
    }
})