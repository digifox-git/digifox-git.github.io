window.addEventListener('DOMContentLoaded', function() {

    let browserType = "Browser"
    
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

    document.getElementById("entertitletext").textContent = browserType

})
