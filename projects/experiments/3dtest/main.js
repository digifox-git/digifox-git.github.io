import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { update_int_music, start_tracks } from './music.js';
import { InteractionManager } from 'threeinteractive'

const loadingManager = new THREE.LoadingManager()

loadingManager.onLoad = function() {
    let loadingScreen = document.getElementById("loading")
    console.log("Finished loading THREE.js scene!")
    loadingScreen.classList.add("fade")
    loadingScreen.addEventListener("animationend", () => {
        loadingScreen.remove()
    })
    start_tracks()
}

let pod_move = new Audio('assets/pod_cursor_move.wav')
pod_move.volume = 0.5
let pod_select = new Audio('assets/pod_select.wav')
pod_select.volume = 0.5

let currentMenu = "main"

// Set up scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)

// Create global lighting
const hemiLight = new THREE.HemisphereLight(0xffffff,  0xffffff, 1.0)
scene.add(hemiLight)

const loader = new GLTFLoader(loadingManager)

const basePos = new THREE.Vector3(0, 0, 0)
const earthPos = new THREE.Vector3(0, 0, 3.3)
const moonPos = new THREE.Vector3(0, 0, -3.3)

const mainCamPos = new THREE.Vector3(8, 0, 0)
const earthCamPos = new THREE.Vector3(3.6, 1, -0.6)
const moonCamPos = new THREE.Vector3(2, 0.7, -0.8)

let earth;
let earthModel
let moon;
let moonModel

let ui_planetSelectorTarget = earthPos
let ui_planetSelectorScale = new THREE.Vector3(0, 0, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
)

// Loads the models and collision shapes for the planets
function load_planets() {
    // Load models
    loader.load('earth.glb', function (gltf) {
        gltf.scene.position.set(earthPos.x, earthPos.y, earthPos.z)
        gltf.scene.scale.set(0.125, 0.125, 0.125)
        gltf.scene.rotateY(8.5)
        scene.add(gltf.scene)
        console.log("Model laoded!")
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
        earthCollision.addEventListener("click", () => {
            if (currentMenu == "main") {
                pod_select.play()
                change_planet(earthCamPos, earthPos, true, "earth", false)
            } else {
                return
            }
            currentMenu = "earth"
        })
        earthCollision.addEventListener("mouseover", () => {
            ui_planetSelectorTarget = earthPos
            ui_planetSelectorScale = new THREE.Vector3(1.05, 1.05, 1.05)
            if (currentMenu == "main") {
                pod_move.play()
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
        console.log("Model laoded!")
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
                pod_select.play()
                change_planet(moonCamPos, moonPos, true, "moon", false)
            } else {
                return
            }
            currentMenu = "moon"
        })
        moonCollision.addEventListener("mouseover", () => {
            ui_planetSelectorTarget = moonPos
            ui_planetSelectorScale = new THREE.Vector3(0.55, 0.55, 0.55)
            if (currentMenu == "main") {
                pod_move.play()
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

load_planets()

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = true
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.rotateSpeed = 0.3

let cameraPos = mainCamPos
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
    pod_move.play()
})

ui_backButton.addEventListener("click", () => {
    pod_select.play()
    toggle_camera_controls(false)
    change_planet(mainCamPos, basePos, false, "base", true)
    currentMenu = "main"
})

function planet_visibility() {
    if (earthModel != undefined && moonModel != undefined) {
        let lerpSpeed = 0.01
        switch (currentMenu) {
            case "earth":
                earthModel.position.lerp(new THREE.Vector3(earthPos.x, earthPos.y, earthPos.z), lerpSpeed)
                moonModel.position.lerp(new THREE.Vector3(moonPos.x, moonPos.y, -50), lerpSpeed)
            break
            case "moon":
                earthModel.position.lerp(new THREE.Vector3(moonPos.y, earthPos.y,50), lerpSpeed)
                moonModel.position.lerp(new THREE.Vector3(moonPos.x, moonPos.y, moonPos.z), lerpSpeed)
            break
            case "main":
                earthModel.position.lerp(new THREE.Vector3(earthPos.x, earthPos.y, earthPos.z), 0.5)
                moonModel.position.lerp(new THREE.Vector3(moonPos.x, moonPos.y, moonPos.z), 0.5)
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

// Redraw
function animate(time) {
    move_camera(cameraPos, 0.15)
    move_target(cameraTarget, 0.15)
    controls.update()
    interactionManager.update()
    planet_selector()
    planet_visibility()
    renderer.render(scene, camera)
    console.log(camera.position)
}

function planet_selector() {
    ui_planetSelector.lookAt(camera.position)
    if (currentMenu != "main") {
        ui_planetSelector.visible = false
    } else {
        ui_planetSelector.visible = true
    }
    ui_planetSelector.position.lerp(ui_planetSelectorTarget, 0.3)
    ui_planetSelector.scale.lerp(ui_planetSelectorScale, 0.3)
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