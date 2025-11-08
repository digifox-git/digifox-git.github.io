const ORBITALTEXT = "Click to enter digifox.space"

window.onload = () => {
    let orbitalText = document.getElementById("orbital-text")

    for (let i = 0; i < ORBITALTEXT.length; i++) {
        let span = document.createElement("span")
        span.innerHTML = ORBITALTEXT[i];
        orbitalText.appendChild(span);
        span.style.transform = `rotate(${5 * i}deg)`
    }
}