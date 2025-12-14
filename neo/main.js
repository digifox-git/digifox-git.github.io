document.addEventListener("DOMContentLoaded", () => {

    // Force loading of certain elements until after DOM is loaded to prevent sidebar from loading slowly

    let globeMap = document.getElementById("mmvst_globe")
    globeMapSrc = "//mapmyvisitors.com/globe.js?d=m98QYc5x6hYrqCI8c0CT8LXBG_XvwcX2V0wEyViRqmQ"
    globeMap.src = globeMapSrc

})