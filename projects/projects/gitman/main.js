document.addEventListener("DOMContentLoaded", () => {

    let updateButton = document.getElementById("update_kubejs_button")
    updateButton.addEventListener("click", () => {
        console.log("Updating!")
        update_kubejs()
    })

    async function update_kubejs() {

        document.getElementById("content").style.background = "linear-gradient(315deg,rgb(31, 31, 31) 0%, rgb(65, 65, 65) 100%)"
        updateButton.innerText = "Please Wait..."

        let authKey = document.getElementById("update_kubejs_auth").value

        let request = await fetch(`http://141.148.171.237:10008/updategit`, {
            method: "GET",
            "headers": {
                "Content-Type": "application/json",
                Authorization: `${authKey}`
            },
        })  

        let res = await request.json();
        console.log(res)

        switch (res) {
            case 200:
                updateButton.innerText = "Updated KubeJS Successfully!"
                document.getElementById("content").style.background = "linear-gradient(315deg,rgb(12, 7, 41) 0%, rgb(26, 14, 79) 100%)"
            break
            case 400:
                updateButton.innerText = "Failed to Update KubeJS!"
                document.getElementById("content").style.background = "linear-gradient(315deg,rgba(41, 7, 7, 1) 0%, rgba(79, 14, 14, 1) 100%)"
            break
            case 401:
                updateButton.innerText = "Invalid Auth Key!"
                document.getElementById("content").style.background = "linear-gradient(315deg,rgba(41, 7, 7, 1) 0%, rgba(79, 14, 14, 1) 100%)"
            break
        }

        setTimeout(() => {
            updateButton.innerText = "Update KubeJS"
            document.getElementById("content").style.background = "linear-gradient(315deg,rgb(31, 31, 31) 0%, rgb(65, 65, 65) 100%)"
        }, 2000);
    }
})