

document.addEventListener("DOMContentLoaded", () => {
    let levelName = document.getElementById("publish_level_name")
    let levelAuth = document.getElementById("publish_level_auth")
    let levelDesc = document.getElementById("publish_level_desc")
    let levelIcon = document.getElementById("publish_level_icon")
    let levelPub = document.getElementById("level_publish")

    let levelsJSON = fetch("./levels/levels.json")

    levelPub.addEventListener("click", () => {
        let level = {
            "name": levelName.value,
            "author": levelAuth.value,
            "description": levelDesc.value,
            "icon": levelIcon.value
        }

        console.log(`Published new level: ${JSON.stringify(level)}`)

        levelName.value = ""
        levelAuth.value = ""
        levelDesc.value = ""
        levelIcon.value = ""

        levelsJSON += level
    })
})