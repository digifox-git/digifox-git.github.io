function url(url) {
    window.location.href = url
}

async function get_file(file, type) {

    const url = `https://axsjb97zxggw.objectstorage.us-phoenix-1.oci.customer-oci.com/p/TSErA683TpIgDwrXVn5Mb7Vg_wVK35mjoajJTHz2r0zq-2zIXvIb72HhjGrtTHFg/n/axsjb97zxggw/b/digifoxdotspace/o/${file}`
    let result = null
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch (${response.status}). I'm a computer, not a dog!!`)
    }

    console.log(response)

    if (type == "json") {
        result = await response.json();
        return result;
    } else if (type == "text") {
        result = await response.text();
    } else if (type == "blob") {
        result = await response.blob();
        return URL.createObjectURL(result);
    }

}

async function logon() {

    const accounts = await get_file('accounts.json', 'json')
    let emailInput = document.getElementById("email").value
    let passwordInput = document.getElementById("password").value

    if (accounts[emailInput]) {
        console.log("(1/2) Valid Email!")
    } else {
        throw new Error(`(err) Invalid Email!`)
    }

    if (accounts[emailInput].password == passwordInput) {
        console.log(`(2/2) Valid Password!`)
    } else {
        throw new Error(`(err) Invalid Password!`)
    }

}

window.addEventListener('DOMContentLoaded', async function() {

    let content = this.document.getElementById("content")
    
})
