history.pushState(null, document.title, location.href);
window.addEventListener('popstate', function (event) {
    history.pushState(null, document.title, location.href);
});

import levelsJSON from '../levels.json' with { type: 'json' }
import { create_pause_button } from '../../assets/javascript/pause.js'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { InteractionManager } from 'threeinteractive'

// Tracks laoding progress
const loadingManager = new THREE.LoadingManager()

document.addEventListener("DOMContentLoaded", () => {
    loadingManager.onLoad = function() {
        let loadingScreen = document.getElementById("loading")
        console.log("Finished loading THREE.js scene!")
        loadingScreen.classList.add("fade_loading")
        play_sound(level_load)
        loadingScreen.addEventListener("animationend", () => {
            create_pause_button()
            loadingScreen.remove()
        })
    }
}) 


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

// 3d Model Loader
const loader = new GLTFLoader(loadingManager)

// Manages click interactions
const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
)

// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

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

// Create sound
let pod_move = new Audio('../../assets/pod_cursor_move.wav')
pod_move.volume = 0.5
let pod_select = new Audio('../../assets/pod_select.wav')
pod_select.volume = 0.5
let pod_error = new Audio('../../assets/pod_error_01.wav')
pod_error.volume = 0.3
let level_load = new Audio('../../assets/audio/level_load_01.wav')
level_load.volume = 0.3
function play_sound(name) {
    name.pause()
    name.currentTime = 0
    name.play()
}

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.rotateSpeed = 0.3

const pmrem = new THREE.PMREMGenerator(renderer)
const env = new RoomEnvironment()
scene.environment = pmrem.fromScene(env).texture

// Load Everything

const cubeTexture = textureLoader.load('../../assets/logo.png', () => {
    console.log("Loaded texture 'cubeTexture'")
})

const cube = new THREE.Mesh(
    new THREE.BoxGeometry,
    new THREE.MeshBasicMaterial({
        map: cubeTexture
    })
)

scene.add(cube)

cube.rotation.set(0, -0.5, 0)

const bgTexture = textureLoader.load('../../assets/images/cloudscropped.png')
scene.background = bgTexture

//

// Redraw
function animate(time) {
    controls.update()
    interactionManager.update()
    renderer.render(scene, camera)
}

camera.position.z = 5

resize()

renderer.setAnimationLoop(animate)