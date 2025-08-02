function travel_to(destination) {
    window.location.href = destination
}

function tab(tab) {
    let tabs = document.querySelectorAll('[role="tab"]')
    let panels = document.querySelectorAll('[role="tabpanel"]')

    tabs.forEach(tab => tab.setAttribute("aria-selected", "false"))
    document.getElementById(`tab-${tab}`).setAttribute("aria-selected", "true")

    panels.forEach(panel => panel.setAttribute("hidden", "true"))
    document.getElementById(`panel-${tab}`).removeAttribute("hidden")
}

function background(path) {
    console.log(path)
    document.getElementById("content").style.setProperty("background-image", path)
}

function generate_topbar() {
    
}