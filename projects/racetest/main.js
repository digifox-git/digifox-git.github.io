/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("simulation");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const racer1 = {image : new Image(), x : 0, y : 0, r : 1, xvel: 2, yvel : 2};
racer1.image.src = "assets/racers/racer1.png";

racer1.image.onload = function() {
    function move() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(racer1.image, racer1.x, racer1.y, 32, 32);
        ctx.beginPath();
        ctx.arc(racer1.x, racer1.y, racer1.r, 0, 0);
        ctx.fill();

        // Get Image Data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        const collisionColor = {r: 255, g: 0, b : 255}

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
        }

        // Update location
        racer1.x += racer1.xvel;
        racer1.y += racer1.yvel;

        // Bounce on wall hit
        if ((racer1.x + 32> canvas.width - racer1.r) || (racer1.x < racer1.r) || (r === collisionColor.r &&  g === collisionColor.g && b === collisionColor.b)) {
            racer1.xvel *= -1
        }
        if ((racer1.y + 32> canvas.height - racer1.r) || (racer1.y < racer1.r)) {
            racer1.yvel *= -1;
        }
        
        window.requestAnimationFrame(move);
    }

    move();
}