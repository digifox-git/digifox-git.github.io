function save_data(storage, value) {
    localStorage.setItem(storage, value)
}

document.addEventListener("DOMContentLoaded", function() {

    let helpButton = document.getElementById("profilehelp")
    let browserType = "your web browser"
    
    switch (true) {
        case /firefox|fxios/i.test(navigator.userAgent):
            browserType = "Firefox"
        break
        case /edg/i.test(navigator.userAgent):
            browserType = "Edge"
        break
        case /opr/i.test(navigator.userAgent):
            browserType = "Opera"
        break
        case /chrome|chromium|crios/i.test(navigator.userAgent):
            browserType = "Chrome"
        break
        case /safari/i.test(navigator.userAgent):
            browserType = "Safari"
        break
        case /MSIE/i.test(navigator.userAgent):
            browserType = "Internet Explorer??????"
        break
        case /Glooper/i.test(navigator.userAgent):
            browserType = "GlooprOS Max 2"
        break
    }


    helpButton.addEventListener("click", function() {
        show_help('All about... you!?', `&nbsp&nbsp This is your profile! Every interactive elements of the site are stored here. Some of them (such as you name and profile image) can be changed fairly easily. Others (such as your inventory and Fun Value) cannot be changed as easily. Resetting your profile will delete every value related to this site in your web browsers local storage.<br><br>Oh, and one more thing: <u>Everything listed on this page is stored locally in ${browserType}. It isnt saved anywhere online, and I dont plan to do that ever!!</u>`)
        console.log("success")
    })

})

function show_help(header, message) {
    var element = document.getElementById('notification-help');
    var elementcontainer = document.getElementById('notificationcontainer-help');
    var elementheader = document.getElementById('notifheader-help')
    var elementmessage = document.getElementById('notifmessage-help')
    var rand = Math.floor(Math.random() * (10000 - 1 + 1)) + 1
    console.log(`Generated a random value! Yours was ${rand} out of 10000!.`)

    if(element.style.display == 'none' ||element.style.display == '') {
        element.style.display = 'flex';
        elementcontainer.style.display = 'flex';
        elementheader.innerHTML = header
        elementmessage.innerHTML = message
    }


}


function hide_help() {
    var element = document.getElementById('notification-help');
    var elementcontainer = document.getElementById('notificationcontainer-help');

    if(element.style.display == 'flex') {
        element.style.display = 'none';
        elementcontainer.style.display = 'none';
    }
}