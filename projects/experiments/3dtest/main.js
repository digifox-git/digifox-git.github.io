import levelsJSON from './levels/levels.json' with { type: 'json' }

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { update_int_music, start_tracks } from './music.js';
import { toggle_news } from './news.js'
import { InteractionManager } from 'threeinteractive'

// Set up scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)

// Create renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create global lighting
const hemiLight = new THREE.HemisphereLight(0xffffff,  0xffffff, 1.0)
scene.add(hemiLight)

// Create sound
let pod_move = new Audio('assets/pod_cursor_move.wav')
pod_move.volume = 0.5
let pod_select = new Audio('assets/pod_select.wav')
pod_select.volume = 0.5
let pod_error = new Audio('assets/pod_error_01.wav')
pod_error.volume = 0.3

function play_sound(name) {
    name.pause()
    name.currentTime = 0
    name.play()
}

// Variable declaration
let currentMenu = "main"
let currentSubmenu = "none"

const basePos = new THREE.Vector3(0, 0, 0)
const earthPos = new THREE.Vector3(0, 0, 3.3)
const moonPos = new THREE.Vector3(0, 0, -3.3)
const introCamPos = new THREE.Vector3(160, 0, 0)
const mainCamPos = new THREE.Vector3(8, 0, 0)
const earthCamPos = new THREE.Vector3(3.6, 1, -0.6)
const moonCamPos = new THREE.Vector3(2, 0.7, -0.8)
let lastCamPos = new THREE.Vector3()

let earth;
let earthModel
let moon;
let moonModel

let ui_planetSelectorTarget = earthPos
let ui_planetSelectorScale = new THREE.Vector3(0, 0, 0)

let ui_levelSelectorTarget = earthPos
let ui_levelSelectorScale = new THREE.Vector3(0, 0, 0)
//

const loadingManager = new THREE.LoadingManager()

loadingManager.onLoad = function() {
    let loadingScreen = document.getElementById("loading")
    console.log("Finished loading THREE.js scene!")
    loadingScreen.classList.add("fade")
    change_planet(mainCamPos, basePos, false, "main", true)
    toggle_news(true)
    loadingScreen.addEventListener("animationend", () => {
        loadingScreen.remove()
    })
    start_tracks()
}

const loader = new GLTFLoader(loadingManager)

const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
)

function load_levels() {
    let levelsKEYS = Object.keys(levelsJSON)
    console.log(`Found ${levelsKEYS.length} levels to load.`)

    loader.load('badge.glb', function(gltf) {

        for (let i = 0; i < levelsKEYS.length; i++) {
            let level = gltf.scene.clone(true)

            console.log(`Loading level "${levelsJSON[i].name}"`)
            level.position.set(levelsJSON[i].coordinates.x, levelsJSON[i].coordinates.y, levelsJSON[i].coordinates.z)
            level.scale.set(levelsJSON[i].scale, levelsJSON[i].scale, levelsJSON[i].scale)
            level.lookAt(earthPos)
            level.JSONkey = i
            if (levelsJSON[i].type == "earth") {
                level.name = "level_earth"
            } else if (levelsJSON[i].type == "moon") {
                level.name = "level_moon"
            }
            level.addEventListener("click", () => {
                if (currentMenu != "main" && currentSubmenu == "none") {
                    lastCamPos = camera.position.clone()

                    // Get local right vector
                    const right = new THREE.Vector3(-1, 0, 0)
                    right.applyQuaternion(level.quaternion)

                    // Get local forward vector
                    const front = new THREE.Vector3(0, 0, -1)
                    front.applyQuaternion(level.quaternion)

                    const badgeTarget = level.position.clone().add(right.multiplyScalar(1))
                    const badgeCamPos = level.position.clone().add(front.multiplyScalar(2))

                    play_sound(pod_select)
                    set_level_info(level.JSONkey)
                    toggle_level_info(true)
                    change_planet(badgeCamPos, badgeTarget, true, levelsJSON[i].type, true)
                    
                    currentSubmenu = "level"
                }
            })
            level.addEventListener("mouseover", () => {
                if (currentMenu != "main" && currentSubmenu == "none") {
                    // Get local forward vector
                    const front = new THREE.Vector3(0, 0, -1)
                    front.applyQuaternion(level.quaternion)
                    ui_levelSelector.lookAt(level)
                    ui_levelSelectorTarget = level.position.clone().add(front.multiplyScalar(0.025))
                    ui_levelSelector.visible = true
                    ui_levelSelectorScale = new THREE.Vector3(0.09, 0.09, 0.09)
                    if (currentMenu != "main") {
                        play_sound(pod_move)
                    } else {
                        return
                    }
                }
            }) 
            level.addEventListener("mouseleave", () => {
                ui_levelSelectorScale = new THREE.Vector3(0.06, 0.06, 0.06)
                ui_levelSelector.visible = false
            }) 
            scene.add(level)
            interactionManager.add(level)
        }
    })
}

// Loads the models and collision shapes for the planets
function load_planets() {
    // Load models
    loader.load('earth.glb', function (gltf) {
        gltf.scene.position.set(earthPos.x, earthPos.y, earthPos.z)
        gltf.scene.scale.set(0.125, 0.125, 0.125)
        gltf.scene.rotateY(8.5)
        scene.add(gltf.scene)
        console.log("Loaded model 'earth.glb'")
        earth = gltf
        earthModel = gltf.scene


        // Create collision object
        const earthCollision = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 16, 16),
            new THREE.MeshBasicMaterial({
                visible: false
            })
        )
        scene.add(earthCollision)
        earthCollision.position.copy(earthModel.position)
        interactionManager.add(earthCollision)

        // interactionManager.add(earthModel)
        // const raycaster = new THREE.Raycaster()
        // const mouse = new THREE.Vector2()

        // earthModel.addEventListener("click", (event) => {
        //     mouse.set(
        //         event.coords.x,
        //         event.coords.y
        //     )

        //     console.log(event.coords.x)

        //     raycaster.setFromCamera(mouse, camera)

        //     const hits = raycaster.intersectObject(earthModel, true)

        //     if (hits.length > 0) {
        //         console.log("Hit: ", hits[0].point)
        //     }
        // })


        earthCollision.addEventListener("click", (event) => {
            if (currentMenu == "main") {
                currentMenu = "earth"
                play_sound(pod_select)
                change_planet(earthCamPos, earthPos, true, "earth", false)
            } else {
                return
            }
        })
        earthCollision.addEventListener("mouseover", () => {
            ui_planetSelectorTarget = earthPos
            ui_planetSelectorScale = new THREE.Vector3(1.05, 1.05, 1.05)
            if (currentMenu == "main") {
                play_sound(pod_move)
            } else {
                return
            }
        }) 
        earthCollision.addEventListener("mouseleave", () => {
            ui_planetSelectorTarget = earthPos
            ui_planetSelectorScale = new THREE.Vector3(0.8, 0.8, 0.8)
        }) 
    }, undefined, function (error) {
        console.error(error)
    })
    loader.load('moon.glb', function (gltf) {
        gltf.scene.position.set(moonPos.x, moonPos.y, moonPos.z)
        gltf.scene.scale.set(0.0025, 0.0025, 0.0025)
        scene.add(gltf.scene)
        console.log("Loaded model 'moon.glb")
        moon = gltf
        moonModel = gltf.scene
        // Create collision object
        const moonCollision = new THREE.Mesh(
            new THREE.SphereGeometry(1.25, 16, 16),
            new THREE.MeshBasicMaterial({
                visible: false
            })
        )
        scene.add(moonCollision)
        moonCollision.position.copy(moonModel.position)
        interactionManager.add(moonCollision)
        moonCollision.addEventListener("click", () => {
            if (currentMenu == "main") {
                currentMenu = "moon"
                play_sound(pod_select)
                change_planet(moonCamPos, moonPos, true, "moon", false)
            } else {
                return
            }
        })
        moonCollision.addEventListener("mouseover", () => {
            ui_planetSelectorTarget = moonPos
            ui_planetSelectorScale = new THREE.Vector3(0.55, 0.55, 0.55)
            if (currentMenu == "main") {
                play_sound(pod_move)
            }
        }) 
        moonCollision.addEventListener("mouseleave", () => {
            ui_planetSelectorTarget = moonPos
            ui_planetSelectorScale = new THREE.Vector3(0.45, 0.45, 0.45)
        }) 
    }, undefined, function (error) {
        console.error(error)
    })
}

// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)
const bgTexture = textureLoader.load('space.jpg')
bgTexture.colorSpace = THREE.SRGBColorSpace
scene.background = bgTexture

// Planet Selector Effect
const ui_planetSelectorTexture = textureLoader.load('assets/planet_selector.png', () => {
    console.log("Loaded texture 'ui_planetSelector'")
})

const ui_planetSelector = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({
        map: ui_planetSelectorTexture,
        transparent: true
    })
)

ui_planetSelector.position.copy(earthPos)
ui_planetSelector.rotateY(90)
scene.add(ui_planetSelector)

const ui_levelSelector = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({
        map: ui_planetSelectorTexture,
        side: THREE.DoubleSide,
        transparent: true
    })
)

ui_levelSelector.position.copy(earthPos)
ui_levelSelector.rotateY(90)
scene.add(ui_levelSelector)


load_levels()
load_planets()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.rotateSpeed = 0.3

let cameraPos = introCamPos
let cameraTarget = basePos
camera.position.lerp(cameraPos, 1)

const pmrem = new THREE.PMREMGenerator(renderer)
const env = new RoomEnvironment()

scene.environment = pmrem.fromScene(env).texture

let animatingCamera = false

function toggle_back_button(bool) {
    if (bool == true) {
        ui_backButton.style.display = "block"
        ui_backButton.classList.remove("shrink")
        ui_backButton.classList.add("bouncein")
    } else {
        ui_backButton.classList.remove("bouncein")
        ui_backButton.classList.add("shrink")
        ui_backButton.addEventListener("animationend", () => {
            if (ui_backButton.querySelector(".shrink")) {
                ui_backButton.style.display = "none"
            }
        })
    }
}

// let ui_volumeDiv = document.getElementById("volume_button")
// let ui_volumeButton = document.getElementById("volume_button_button")
// let ui_volumeSlider = document.getElementById("volume_slider")
// function toggle_volume_button(bool) {
//     if (bool == true) {
//         ui_volumeDiv.style.display = "flex"
//         ui_volumeDiv.classList.remove("shrink")
//         ui_volumeDiv.classList.add("bouncein")
//     } else {
//         ui_volumeDiv.classList.remove("bouncein")
//         ui_volumeDiv.classList.add("shrink")
//         ui_volumeDiv.addEventListener("animationend", () => {
//             if (ui_volumeDiv.querySelector(".shrink")) {
//                 ui_volumeDiv.style.display = "none"
//             }
//         })
//     }
// }

// let volumeVisible = false
// ui_volumeButton.addEventListener("click", () => {
//     volumeVisible = !volumeVisible
//     switch (volumeVisible) {
//         case true:
//             ui_volumeSlider.style.display = "flex"
//         break
//         case false:
//             ui_volumeSlider.style.display = "none"
//         break
//     }
//     play_sound(pod_select)
// })

// ui_volumeSlider.addEventListener("change", () => {

// })

let level_info = document.getElementById("level_info")

function set_level_info(id) {
    let name = document.getElementById("level_name")
    let auth = document.getElementById("level_auth")
    let desc = document.getElementById("level_desc")
    let icon = document.getElementById("level_icon_image")

    name.innerHTML = levelsJSON[id].name
    auth.innerHTML = `By ${levelsJSON[id].author}`
    desc.innerHTML = levelsJSON[id].description
    icon.src = levelsJSON[id].icon
}

function toggle_level_info(bool) {
    if (bool == true) {
        level_info.style.display = "block"
        level_info.classList.remove("shrinktoleft")
        level_info.classList.add("growtoright")
    } else {
        level_info.classList.remove("growtoright")
        level_info.classList.add("shrinktoleft")
        level_info.addEventListener("animationend", () => {
            if (level_info.querySelector(".shrinktoleft")) {
                level_info.style.display = "none"
            }
        })
    }
}

function toggle_camera_controls(bool) {
    if (bool == true) {
        controls.enabled = true
    } else {
        controls.enabled = false
    }
}

let freezeCamera = true // move_camera checks if this is true or not when finished moving to know if controls should be unlocked

function change_planet(targetCameraPosition, targetCameraTarget, toggleBackButton, intMusic, freezeCameraControl) {
    animatingCamera = true
    cameraPos = targetCameraPosition
    cameraTarget = targetCameraTarget
    toggle_back_button(toggleBackButton)
    update_int_music(intMusic)
    freezeCamera = freezeCameraControl
}

let ui_backButton = document.getElementById("back_button")
ui_backButton.addEventListener("mouseover", () => {
    play_sound(pod_move)
})

ui_backButton.addEventListener("click", () => {
    play_sound(pod_select)
    toggle_camera_controls(false)
    switch (currentMenu) {
        case "earth":
            if (currentSubmenu == "level") {
                change_planet(lastCamPos, earthPos, true, "earth", false)
                toggle_level_info(false)
            } else {
                change_planet(mainCamPos, basePos, false, "base", true)
                currentMenu = "main"
            }
            currentSubmenu = "none"
        break
        case "moon":
            if (currentSubmenu == "level") {
                change_planet(lastCamPos, moonPos, true, "moon", false)
                toggle_level_info(false)
            } else {
                change_planet(mainCamPos, basePos, false, "base", true)
                currentMenu = "main"
            }
            currentSubmenu = "none"
        break
    }
})

let ui_playbutton = document.getElementById("level_play")
ui_playbutton.addEventListener("mouseover", () => {
    play_sound(pod_move)
})

ui_playbutton.addEventListener("click", () => {
    play_sound(pod_error)
})

function planet_visibility() {

    if (earthModel != undefined && moonModel != undefined) {
        let lerpSpeed = 0.01
        switch (currentMenu) {
            case "earth":
                earthModel.position.lerp(new THREE.Vector3(earthPos.x, earthPos.y, earthPos.z), lerpSpeed)
                moonModel.position.lerp(new THREE.Vector3(moonPos.x, moonPos.y, -50), lerpSpeed)
                scene.traverse(obj => {
                    if (obj.name == "level_earth") {
                        obj.visible = true
                    } else if (obj.name == "level_moon") {
                        obj.visible = false
                    }
                })
            break
            case "moon":
                earthModel.position.lerp(new THREE.Vector3(moonPos.y, earthPos.y,50), lerpSpeed)
                moonModel.position.lerp(new THREE.Vector3(moonPos.x, moonPos.y, moonPos.z), lerpSpeed)
                scene.traverse(obj => {
                    if (obj.name == "level_moon") {
                        obj.visible = true
                    } else if (obj.name == "level_earth") {
                        obj.visible = false
                    }
                })
            break
            case "main":
                earthModel.position.lerp(new THREE.Vector3(earthPos.x, earthPos.y, earthPos.z), 0.5)
                moonModel.position.lerp(new THREE.Vector3(moonPos.x, moonPos.y, moonPos.z), 0.5)
                scene.traverse(obj => {
                    if (obj.name == "level_moon" || obj.name == "level_earth") {
                        obj.visible = true
                    }
                })
            break
        }
        if (earthModel.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 10) {
            earthModel.visible = false
        } else {
            earthModel.visible = true
        }
        if (moonModel.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 10) {
            moonModel.visible = false
        } else {
            moonModel.visible = true
        }
    }
}

function news_visibility() {
    if (currentMenu == "main" && currentSubmenu == "none") {
        toggle_news(true)
    } else {
        toggle_news(false)
    }
}

// Redraw
function animate(time) {
    move_camera(cameraPos, 0.15)
    move_target(cameraTarget, 0.15)
    selectors()
    planet_visibility()
    news_visibility()
    controls.update()
    interactionManager.update()
    renderer.render(scene, camera)
}

function selectors() {
    ui_planetSelector.lookAt(camera.position)
    ui_levelSelector.lookAt(earthPos)
    if (currentMenu != "main") {
        ui_planetSelector.visible = false
    } else {
        ui_planetSelector.visible = true
    }
    ui_planetSelector.position.lerp(ui_planetSelectorTarget, 0.3)
    ui_planetSelector.scale.lerp(ui_planetSelectorScale, 0.3)

    if (currentMenu != "main") {
        ui_levelSelector.visible = true
    } else {
        ui_levelSelector.visible = false
    }
    ui_levelSelector.position.set(ui_levelSelectorTarget.x, ui_levelSelectorTarget.y, ui_levelSelectorTarget.z)
    ui_levelSelector.scale.lerp(ui_levelSelectorScale, 0.3)
}

function level_selector() {

}

function move_camera(pos, speed) {
    if (camera.position.distanceTo(cameraPos) > 0.015 && animatingCamera == true) {
        camera.position.lerp(pos, speed)
    } else {
        animatingCamera = false
        if (freezeCamera == true) {
            toggle_camera_controls(false)
        } else {
            toggle_camera_controls(true)
        }
    }
}

function move_target(pos, speed) {
    controls.target.lerp(pos, speed)
}

// Resize 3d environment dynamically
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

// Call 3d environment resize when window size changes
window.addEventListener('resize', () => {
    resize()
})

resize()

renderer.setAnimationLoop(animate)