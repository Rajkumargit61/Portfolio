import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// Setup basic scene
const scene = new THREE.Scene();

// Setup camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Setup renderer
const canvasContainer = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimizations
canvasContainer.appendChild(renderer.domElement);

// Create Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2500;

// arrays for positions and velocities
const posArray = new Float32Array(particlesCount * 3);
const velocities = [];

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles over a large volume (x, y, z)
    posArray[i] = (Math.random() - 0.5) * 100;
    
    // If it's the start of a triplet (x), add a velocity vector
    if (i % 3 === 0) {
        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });
    }
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create material for points
const material = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// Mouse Interaction variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();

    // Subtle automatic rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Mouse parallax effect (smoothed)
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    
    // Scroll effect (move camera down/up based on scroll)
    camera.position.y = -scrollY * 0.01;
    camera.position.x = scrollY * 0.005;

    // Optional: make particles drift slightly based on velocities array
    // You can access position attributes to animate individual points 
    // but a global rotation + camera move is cleaner and more performant 
    // for a data science background.

    renderer.render(scene, camera);
}

animate();
