document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const player = document.getElementById("player")

    player.addEventListener("load", (e) => {
        ctx.drawImage(player, 8, 8)
        console.log("Loaded")
    })
})


