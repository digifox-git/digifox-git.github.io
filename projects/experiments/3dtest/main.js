// BUGS //
// - Hovering over a level in base camera position unhovers planet, so pod_move plays again when you hover planet again, even if level is on that planet.
// - Scene tends to lag sometimes. May be caused by interactionManager and level badges?
// - Right click and wiggle to shrink planets?? Might keep
// --- //

// TO-DO //
// - Make level badges children of planets so they can be moved with the planet if needed
// --- //

import levelsJSON from './levels/levels.json' with { type: 'json' }

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { update_int_music, start_tracks } from './music.js';
import { toggle_news } from './news.js'
import { InteractionManager } from 'threeinteractive'
import { check_path } from './assets/javascript/helpers.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import { play_sound } from './assets/javascript/helpers.js';

// Tracks all loaders with loadingManager passed into them and acts when
// All things in the loaders are completed. Woop woop
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = function() {
    let loadingScreen = document.getElementById("loading") // Loading screen
    let spinner = document.getElementById("pulser") // Loading screen progress image
    console.log("Finished loading THREE.js scene!")
    loadingScreen.classList.add("fade") // Fade loading screen
    spinner.remove() // Destroy loading screen progress image
    change_planet(mainCamPos, basePos, false, "main", true) // Set camera
    loadingScreen.addEventListener("animationend", () => {
        loadingScreen.remove() // Remove loading screen from DOM when it finishes fading
    })
    start_tracks() // Start music
}


// Basic 3D environment setup. Try to guess what the first 3 things do //
const scene = new THREE.Scene() // Creates the environment that things can be placed in
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight) // Use whole size of website to show environment
document.body.appendChild(renderer.domElement)

const pmrem = new THREE.PMREMGenerator(renderer) // Generates a Prefiltered, Mipmapped Radiance Environment Map
                                                 // (Needed so models will be lit up)
const roomEnvironment = new RoomEnvironment() // Template lighting for PMREM 
scene.environment = pmrem.fromScene(roomEnvironment).texture // Sets scene environment to generated one. Essential planet lighting!
// --- //

// Variable declaration //
let currentMenu = "main"
let currentSubmenu = "none"

// This could be improved. I will think about it later.
const basePos = new THREE.Vector3(0, 0, 0)
const earthPos = new THREE.Vector3(0, 0, 3.3)
const moonPos = new THREE.Vector3(0, 0, -3.3)
const introCamPos = new THREE.Vector3(160, 0, 0)
const mainCamPos = new THREE.Vector3(8, 0, 0)
const earthCamPos = new THREE.Vector3(3.6, 1, -0.6)
const moonCamPos = new THREE.Vector3(2, 0.7, -0.8)
let lastCamPos = new THREE.Vector3() // Sets camera position to where it was before level was selected

let earth; // No use currently, but it's nice to have?
let earthModel
let moon; // No use currently, but it's nice to have?
let moonModel

let ui_planetSelectorTarget = earthPos
let ui_planetSelectorScale = new THREE.Vector3(0, 0, 0)

let ui_levelSelectorTarget = earthPos
let ui_levelSelectorScale = new THREE.Vector3(0, 0, 0)
// --- //

// Loader creation //
const textureLoader = new THREE.TextureLoader(loadingManager)

const modelLoader = new GLTFLoader(loadingManager)
// --- //

// Models added to the interactionManager can be interacted with
// Using the mouse. Possible with base THREE.js but I like not having
// all the joy in my live sucked out of me with a THREE.js-shaped straw.
const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
)

// Not universal but is cleaner
function load_texture(path) {
    let texture = textureLoader.load(path)
    return texture
}

// Sets the background image
const bgTexture = load_texture('space.jpg')
bgTexture.colorSpace = THREE.SRGBColorSpace
scene.background = bgTexture

function load_levels() {
    let levelsKEYS = Object.keys(levelsJSON)
    console.log(`Found ${levelsKEYS.length} levels to load.`)

    modelLoader.load('assets/models/level_badge.glb', function(gltf) {

        for (let i = 0; i < levelsKEYS.length; i++) {
            let level = SkeletonUtils.clone(gltf.scene) // Clone with SkeletonUtils to copy armature to every clone
                                                        // Position and scale will break with gltf.scene.clone()
                                                        // Because it does not copy the armature

            console.log(`Loading level "${levelsJSON[i].name}"`)

            // Set paramaters from JSON
            level.position.set(levelsJSON[i].coordinates.x, levelsJSON[i].coordinates.y, levelsJSON[i].coordinates.z)
            level.scale.set(levelsJSON[i].scale, levelsJSON[i].scale, levelsJSON[i].scale)

            level.JSONkey = i // Makes it easier to reference specific level later

            // Internal names for potiential future use - Not currently used for anything
            if (levelsJSON[i].type == "earth") {
                level.name = "level_earth"
                level.lookAt(earthPos)
            } else if (levelsJSON[i].type == "moon") {
                level.name = "level_moon"
                level.lookAt(moonPos)
            }

            // Load desired material texture
            level.traverse(child => {
                if (child.isMesh && child.material.name == "badge_entrance_circular_zip") { // Material used for zipper ring
                    child.material = child.material.clone() // Prevents material from being overwritten.
                                                            // (zipper and badge icon material share same geometry)
                }
                if (child.isMesh && child.material.name == "badge_zip_entrance_cloth") { // Material used for main badge texture
                    child.material = child.material.clone()
                    const texture = textureLoader.load(levelsJSON[i].icon, () => {
                        texture.flipY = false // Prevent texture from appearing upside down
                        child.material.map = texture // Map texure
                    })
                }
            }) 

            // Dev code used to help adjust specific badge placement. Probably need something easier than this but OH WELL!!!
            // const front = new THREE.Vector3(0, 0, -1)
            // front.applyQuaternion(level.quaternion)
            // level.position.add(front.multiplyScalar(0.008))
            // const right = new THREE.Vector3(-1, 0, 0)
            // right.applyQuaternion(level.quaternion)
            // level.position.add(right.multiplyScalar(0.0125))
            // const down = new THREE.Vector3(0, -1, 0)
            // down.applyQuaternion(level.quaternion)
            // level.position.add(down.multiplyScalar(0.0125))

            level.addEventListener("click", () => {
                if (currentMenu != "main" && currentSubmenu == "none") {
                    lastCamPos = camera.position.clone()

                    // Get local forward and right vectors of level badge so camera can be positioned //
                    // relative to level badge position //
                    const right = new THREE.Vector3(-1, 0, 0)
                    right.applyQuaternion(level.quaternion)

                    const front = new THREE.Vector3(0, 0, -1)
                    front.applyQuaternion(level.quaternion)
                    // --- //

                    // multiplyScalar to adjust camera position when badge is clicked //
                    const badgeTarget = level.position.clone().add(right.multiplyScalar(1))
                    const badgeCamPos = level.position.clone().add(front.multiplyScalar(2))
                    // --- //

                    play_sound("pod_select", 0.5)
                    set_level_info(level.JSONkey) // Set level info before details are showed to user
                    toggle_level_info(true) // Show level details popup, including play button
                    change_planet(badgeCamPos, badgeTarget, true, levelsJSON[i].type, true) // Set cam pos to position we got from
                                                                                            // Getting those forward and right vectors
                    
                    currentSubmenu = "level"
                }
            })
            level.addEventListener("mouseenter", () => { // Move ui_levelSelector to hovered planet
                console.log(level.position)
                if (currentMenu != "main" && currentSubmenu == "none") {
                    hover_level(level)
                    
                    if (currentMenu != "main") {
                        play_sound("pod_move", 0.5)
                    }
                }
            }) 
            level.addEventListener("mouseleave", () => { // Hide ui_levelSelector on unhover
                ui_levelSelector.visible = false
                ui_levelSelectorScale = new THREE.Vector3(0, 0, 0)
            }) 
            scene.add(level) // Add level to scene
            interactionManager.add(level) // Make model interactable
            
        }
    })
}

// Loads the models and collision shapes for the planets
function load_planets() {
    // Load earth model
    modelLoader.load('assets/models/earth.glb', function (gltf) {
        gltf.scene.position.set(earthPos.x, earthPos.y, earthPos.z)
        gltf.scene.scale.set(0.125, 0.125, 0.125)
        gltf.scene.rotateY(8.5)
        console.log("Loaded model 'earth.glb'")
        earth = gltf
        earthModel = gltf.scene // gltf.scene is the model

        scene.add(earthModel)

        // Create collision object
        // New collision shape for planets is less intensive because interactionManager
        // Doesn't have to deal with as many faces
        const earthCollision = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 16, 16),
            new THREE.MeshBasicMaterial({
                visible: false
            })
        )
        scene.add(earthCollision)
        earthCollision.position.copy(earthModel.position)
        interactionManager.add(earthCollision)

        // LEAVE COMMENTED BEFORE PUSH - Helps get coordinates on planet for level placement. Laggy! Laggy! Laggy!
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
                play_sound("pod_select", 0.5)
                change_planet(earthCamPos, earthPos, true, "earth", false)
            }
        })
        earthCollision.addEventListener("mouseover", () => {
            ui_planetSelectorTarget = earthPos
            ui_planetSelectorScale = new THREE.Vector3(1.05, 1.05, 1.05)
            if (currentMenu == "main") {
                play_sound("pod_move", 0.5)
            }
        }) 
        earthCollision.addEventListener("mouseleave", () => {
            ui_planetSelectorTarget = earthPos
            ui_planetSelectorScale = new THREE.Vector3(0.8, 0.8, 0.8)
        }) 
    }, undefined, function (error) {
        console.error(error)
    })
    // Load moon model
    modelLoader .load('assets/models/moon.glb', function (gltf) {
        gltf.scene.position.set(moonPos.x, moonPos.y, moonPos.z)
        gltf.scene.scale.set(0.0025, 0.0025, 0.0025)
        console.log("Loaded model 'moon.glb")
        moon = gltf
        moonModel = gltf.scene

        scene.add(gltf.scene)

        // interactionManager.add(moonModel)
        // const raycaster = new THREE.Raycaster()
        // const mouse = new THREE.Vector2()

        // moonModel.addEventListener("click", (event) => {
        //     mouse.set(
        //         event.coords.x,
        //         event.coords.y
        //     )

        //     console.log(event.coords.x)

        //     raycaster.setFromCamera(mouse, camera)

        //     const hits = raycaster.intersectObject(moonModel, true)

        //     if (hits.length > 0) {
        //         console.log("Hit: ", hits[0].point)
        //     }
        // })

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
                play_sound("pod_select", 0.5)
                change_planet(moonCamPos, moonPos, true, "moon", false)
            }
        })
        moonCollision.addEventListener("mouseover", () => {
            ui_planetSelectorTarget = moonPos
            ui_planetSelectorScale = new THREE.Vector3(0.55, 0.55, 0.55)
            if (currentMenu == "main") {
                play_sound("pod_move", 0.5)
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

// Planet Selector Effect
const ui_planetSelectorTexture = load_texture('assets/planet_selector.png')

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

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.rotateSpeed = 0.3

let cameraPos = introCamPos
let cameraTarget = basePos
camera.position.lerp(cameraPos, 1)

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

let level_info = document.getElementById("level_info")
let currentLevelID

function set_level_info(id) {
    let name = document.getElementById("level_name")
    let auth = document.getElementById("level_auth")
    let desc = document.getElementById("level_desc")
    let icon = document.getElementById("level_icon_image")

    name.innerHTML = levelsJSON[id].name
    auth.innerHTML = `By ${levelsJSON[id].author}`
    desc.innerHTML = levelsJSON[id].description
    icon.src = levelsJSON[id].icon

    currentLevelID = id
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
let ui_backButtonImage = document.getElementById("back_button_image")
ui_backButtonImage.addEventListener("mouseover", () => {
    play_sound("pod_move", 0.5)
})

// Handles which menu you should go to when clicking the back button 
ui_backButtonImage.addEventListener("click", () => {
    play_sound("pod_back", 0.5)
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
    play_sound("pod_move", 0.5)
})

// Click to fade music and begin level transition 
ui_playbutton.addEventListener("click", async () => {
    if (await check_path(`./levels/${currentLevelID}`) == true) {
        play_sound("pod_select", 0.5)
        play_sound("leave_level", 0.5)
        update_int_music("none")
        const fade = document.createElement('div')
        fade.id = "fade"
        document.body.appendChild(fade)
        fade.addEventListener("animationend", () => {
            location.href = `./levels/${currentLevelID}/index.html?id=${currentLevelID}&enteraslevel=true`
        })
    } else {
        play_sound("pod_error", 0.5)
    }
    console.log(`./levels/${currentLevelID}`)
})

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

function selectors() {
    ui_planetSelector.lookAt(camera.position)
    switch (currentMenu) {
        case "earth":
            ui_levelSelector.lookAt(earthPos)
        break
        case "moon":
            ui_levelSelector.lookAt(moonPos)
        break
    }
    if (currentMenu != "main") {
        ui_planetSelector.visible = false
    } else {
        ui_planetSelector.visible = true
    }
    ui_planetSelector.position.lerp(ui_planetSelectorTarget, 0.3)
    ui_planetSelector.scale.lerp(ui_planetSelectorScale, 0.3)
    ui_levelSelector.position.set(ui_levelSelectorTarget.x, ui_levelSelectorTarget.y, ui_levelSelectorTarget.z)
    ui_levelSelector.scale.lerp(ui_levelSelectorScale, 0.3)
}


// Move ui_levelSelector to level that is being hovered over
function hover_level(level) {
    // Get local forward vector
    const front = new THREE.Vector3(0, 0, -1)
    front.applyQuaternion(level.quaternion)
    ui_levelSelector.lookAt(level)
    ui_levelSelectorTarget = level.position.clone().add(front.multiplyScalar(0.01))
    ui_levelSelectorScale = new THREE.Vector3(level.scale.x - 0.01, level.scale.y - 0.01, level.scale.z - 0.01)
    ui_levelSelector.visible = true
}

load_levels()
load_planets()

// Happens every new frame in 3D World
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