// Import necessary libraries
import './style.css'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

document.getElementById("reset").style.display = "none"
document.getElementById("won").style.display = "none"


console.log("\n\n\nHey, get out of here before you break something!")

var gameOver = false

// Initialize Three.js scene
var scene = new THREE.Scene();

// Create a material
const material = new THREE.MeshPhongMaterial({
    flatShading: true,
});

// Add lights to scene
const light = new THREE.PointLight(0xfc5c7d, 2, 100);
light.position.set(50, 20, -5);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 1.5, 100);
light2.position.set(-50, 15, 50);
scene.add(light2);

const light3 = new THREE.PointLight(0x6a82fb, .5, 100);
light3.position.set(0, -10, 40);
scene.add(light3);


// Add the model to the scene
const loader = new STLLoader()
let mesh; // Declare the mesh variable here
loader.load(
    'models/scan.stl',
    function (geometry) {
        mesh = new THREE.Mesh(geometry, material)
        // mesh.position.y = 0

        mesh.position.z = -40
        scene.add(mesh)
    },
    (xhr) => {
    },
    (error) => {
    }
)

// Create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.set(0, 1, 120);

// Create a renderer
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a responsive Canvas
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector('.webgl');

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    renderer.render(scene, camera); // -> Also needed
});

// Event listeners for mouse and touch movement
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);

// Function to handle mouse movement
function onDocumentMouseMove(event) {
    event.preventDefault();
    var vector = new THREE.Vector3();
    vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.y / dir.z;
    distance = Math.abs(distance) * 50
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    mesh.lookAt(pos);
}


// Function to handle touch movement
function onDocumentTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];
    var vector = new THREE.Vector3();
    vector.set((touch.clientX / window.innerWidth) * 2 - 1, -(touch.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.y / dir.z;
    distance = Math.abs(distance) * 50
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    mesh.lookAt(pos);
}

// Create orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

// Animate function for rendering the scene
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

// Start animation
animate();

var cube;

let counter = 0;
document.getElementById("score").innerHTML = "Your Score: " + counter;

function dropCube() {

    // Create a cube

    let minSides = 3;
    let maxSides = 12;
    let sphereSides = Math.floor(Math.random() * (maxSides - minSides) + minSides);
    let sphereSize = Math.floor(Math.random() * (15 - 8) + 8);

    var geometry = new THREE.SphereGeometry(sphereSize, sphereSides, sphereSides);

    let pastelPalette = ["#F49AC2", "#F5B183", "#F5DA81", "#E1F5C4", "#B3F5E1", "#81F5F1", "#83E6F5", "#A9BFF5",
        "#D5B8F5", "#F5B8D5", "#F5B8A2", "#F5A2B8", "#F5D5B8", "#B8F5A2", "#A2F5B8", "#B8D5F5",
        "#F5D5D5", "#F5A2A2", "#F5B8B8", "#A2F5F5", "#B8F5F5", "#F5F5A2", "#F5F5B8", "#D5F5F5",
        "#F5A2F5", "#F5F5D5", "#F5F5F5", "#A2F5D5", "#B8F5D5", "#D5F5A2", "#D5F5B8"];
    let randomPastelColor = pastelPalette[Math.floor(Math.random() * pastelPalette.length)];

    var material = new THREE.MeshPhongMaterial({
        flatShading: true,
        color: randomPastelColor,
    });
    var cube = new THREE.Mesh(geometry, material);

    // Position the cube at the top of the screen
    cube.position.y = 100;

    let minStart = -50;
    let maxStart = 50;

    let rndInt = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart

    cube.position.x = rndInt;
    cube.position.z = 10;
    // Add the cube to the scene
    scene.add(cube);

    cube.intersected = false;

    // Animate the cube falling to the bottom of the screen
    var tween = new TWEEN.Tween(cube.position)
        .to({ y: -100 }, 4000)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(function () {
            scene.remove(cube);
            if (cube.intersected == false && gameOver == false) {
                if (counter > 0) {
                    counter = (counter - 1);
                    document.getElementById("score").innerHTML = "Your Score: " + counter;

                }
            }
        });
    tween.start();


    // Rotate the cube
    let min = 0;
    let max = 5;
    let randomFloat = (Math.random() * (max - min) + min).toFixed(3);
    cube.rotation.x = randomFloat;
    cube.rotation.y = randomFloat;
    cube.rotation.z = randomFloat;

    // Create a raycaster
    var raycaster = new THREE.Raycaster();

    // On mouse move event
    window.addEventListener('mousedown', function (event) {
        // Normalize the mouse position
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Set the raycaster to cast from the mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with the cube
        var intersects = raycaster.intersectObjects([cube]);
        if (intersects.length > 0 && !cube.intersected) {
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000,
                linewidth: 1,
            });

            const points = [];
            let vector = new THREE.Vector3();
            vector.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                - (event.clientY / window.innerHeight) * 2 + 1,
                0
            );
            vector.unproject(camera);

            points.push(new THREE.Vector3(0, 0, 0));
            points.push(vector);

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);

            // Change color of intersected object to white
            intersects[0].object.material.color.setHex(0xFF0000);

            var tween2 = new TWEEN.Tween(cube.scale)
                .to({ x: 2, y: 1, z: 2 }, 300)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(function () {
                    scene.remove(cube);
                    scene.remove(line);
                });
            tween2.start();

            counter += 1;

            document.getElementById("score").innerHTML = "Your Score: " + counter;

            if (counter > 24) {
                document.getElementById("subhead").style.display = "none"
                document.getElementById("won").style.display = "block"
                document.getElementById("win").innerHTML = "Your Score: 25 <br> You won!";
                document.getElementById("reset").style.display = "block"
                document.getElementById("win").style.display = "none"
                document.getElementById("score").innerHTML = "";
                scene.remove(line);
                gameOver = true;
            }

            cube.intersected = true;
        }

    }, false);


    // Schedule the next drop
    if (gameOver == false) {
        setTimeout(dropCube, Math.random() * 600);
    } else if (gameOver == true) {
        scene.remove(cube);
        scene.remove(mesh)
        cube.geometry.dispose();
        mesh.geometry.dispose();
        // renderer.renderLists.dispose();
        scene.remove.apply(scene, scene.children);


        function createConfetti(scene, num) {
            var confettiGroup = new THREE.Group();
            scene.add(confettiGroup);

            var confettiMaterial = new THREE.MeshPhongMaterial({
                color: 0xff0000,
                specular: 0xffffff,
                shininess: 20
            });

            let min = 1;
            let max = 15;
            let confettiLength = (Math.random() * (max - min) + min).toFixed(3);

            var confettiGeometry = new THREE.BoxGeometry(4, 1, confettiLength);

            for (var i = 0; i < num; i++) {
                var confettiMesh = new THREE.Mesh(confettiGeometry, confettiMaterial);
                confettiMesh.position.x = Math.random() * 2 - 1;
                confettiMesh.position.y = Math.random() * 2 - 1;
                confettiMesh.position.z = Math.random() * 2 - 1;
                confettiGroup.add(confettiMesh);
            }
            return confettiGroup;
        }

        function animateConfetti(confettiGroup) {
            // Set an initial rotation and velocity for each confetti
            confettiGroup.children.forEach(function (confetti) {
                confetti.rotationSpeed = {
                    x: Math.random() * 0.01,
                    y: Math.random() * 0.01,
                    z: Math.random() * 0.01
                };
                confetti.velocity = {
                    x: Math.random() * 0.1 - 0.05,
                    y: Math.random() * 0.1 - 0.05,
                    z: Math.random() * 0.1 - 0.05
                };
            });

            // Update the confetti's rotation and position in the animation loop
            function update() {
                confettiGroup.children.forEach(function (confetti) {
                    confetti.rotation.x += confetti.rotationSpeed.x;
                    confetti.rotation.y += confetti.rotationSpeed.y;
                    confetti.rotation.z += confetti.rotationSpeed.z;

                    confetti.position.x += confetti.velocity.x * 3;
                    confetti.position.y += confetti.velocity.y * 3;
                    confetti.position.z += confetti.velocity.z * 3;
                });
                requestAnimationFrame(update);
            }
            update();
        }

        var confettiGroup = createConfetti(scene, 100);
        scene.add(confettiGroup);
        animateConfetti(confettiGroup);

    }

}

dropCube();

// Disable Right Click
document.addEventListener('contextmenu', event => event.preventDefault());


