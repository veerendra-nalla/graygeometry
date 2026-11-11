// --- Three.js Hero Setup: South Indian Modern Luxury for Gray Geometry ---
const container = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.FogExp2('#0A0A0A', 0.015); // Lighter fog for depth without masking background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;
camera.position.y = 5;
camera.position.x = 0;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- Materials ---
const sandstoneMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4A373,
    roughness: 0.7,
    metalness: 0.1
});

const terracottaMaterial = new THREE.MeshStandardMaterial({
    color: 0xC85A17,
    roughness: 0.8,
    metalness: 0.05
});

const teakWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x5C3A21,
    roughness: 0.4,
    metalness: 0.1
});

const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    roughness: 0.3,
    metalness: 1.0
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.8,
    envMapIntensity: 1.0,
    clearcoat: 1.0
});

const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x112222,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.8
});

// Jali Alpha Map
const jaliCanvas = document.createElement('canvas');
jaliCanvas.width = 512; jaliCanvas.height = 512;
const ctx = jaliCanvas.getContext('2d');
ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 512);
ctx.fillStyle = '#000000';
for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
        ctx.save();
        ctx.translate(i * (512 / 12) + (512 / 24), j * (512 / 12) + (512 / 24));
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-(512 / 40), -(512 / 40), 512 / 20, 512 / 20);
        ctx.restore();
    }
}
const jaliTex = new THREE.CanvasTexture(jaliCanvas);
jaliTex.wrapS = jaliTex.wrapT = THREE.RepeatWrapping;
jaliTex.repeat.set(2, 2);

const jaliMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4A373,
    alphaMap: jaliTex,
    transparent: true,
    roughness: 0.8,
    side: THREE.DoubleSide
});

// --- Architecture Group ---
const buildingGroup = new THREE.Group();

// Base
const base = new THREE.Mesh(new THREE.BoxGeometry(20, 0.5, 14), sandstoneMaterial);
base.position.y = -0.25;
base.receiveShadow = true;
buildingGroup.add(base);

// Main Block
const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 6), sandstoneMaterial);
mainBlock.position.set(0, 3, -2);
mainBlock.castShadow = true;
buildingGroup.add(mainBlock);

// Window
const mainWindow = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 0.2), glassMaterial);
mainWindow.position.set(0, 3, 1.1);
buildingGroup.add(mainWindow);

// Roof
const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 3, 4), terracottaMaterial);
roof.rotation.y = Math.PI / 4;
roof.scale.set(1, 1, 0.8);
roof.position.set(0, 7.5, -2);
roof.castShadow = true;
buildingGroup.add(roof);

// Pillars
const pillarGeo = new THREE.BoxGeometry(0.4, 5, 0.4);
for (let i = 0; i < 4; i++) {
    const pillar = new THREE.Mesh(pillarGeo, teakWoodMaterial);
    pillar.position.set(-4.5 + (i * 3), 2.5, 4);
    pillar.castShadow = true;
    buildingGroup.add(pillar);

    const ring = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), brassMaterial);
    ring.position.set(-4.5 + (i * 3), 0.15, 4);
    buildingGroup.add(ring);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), brassMaterial);
    cap.position.set(-4.5 + (i * 3), 4.9, 4);
    buildingGroup.add(cap);
}

// Overhang
const overhang = new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 4), teakWoodMaterial);
overhang.position.set(0, 5.2, 3);
overhang.castShadow = true;
buildingGroup.add(overhang);

// Stepping Stones
const stoneGeo = new THREE.BoxGeometry(1.5, 0.2, 1);
for (let i = 0; i < 3; i++) {
    const stone = new THREE.Mesh(stoneGeo, sandstoneMaterial);
    stone.position.set(-2 + (i * 2), 0.1, 6.5);
    buildingGroup.add(stone);
}

// Jali
const jali = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), jaliMaterial);
jali.rotation.y = Math.PI / 2;
jali.position.set(-5.1, 3, -2);
buildingGroup.add(jali);

// Pond
const pond = new THREE.Mesh(new THREE.BoxGeometry(18, 0.1, 4), waterMaterial);
pond.position.set(0, 0.06, 6.5);
buildingGroup.add(pond);

buildingGroup.scale.setScalar(1.2);
buildingGroup.position.y = -1;
scene.add(buildingGroup);

// --- Fireflies ---
const particlesGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(500 * 3); // More particles
for (let i = 0; i < 500 * 3; i++) posArray[i] = (Math.random() - 0.5) * 40;
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMesh = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ size: 0.12, color: 0xD4AF37, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
scene.add(particleMesh);

// --- Lighting ---
scene.add(new THREE.AmbientLight(0xffddaa, 0.5));
const dirLight = new THREE.DirectionalLight(0xff9955, 1.8);
dirLight.position.set(10, 10, 10);
dirLight.castShadow = true;
scene.add(dirLight);

// Interior Glow Lights
const light1 = new THREE.PointLight(0xffaa44, 2, 15);
light1.position.set(0, 3, 0);
scene.add(light1);

const light2 = new THREE.PointLight(0xff7733, 1.5, 10);
light2.position.set(-3, 2, -1);
scene.add(light2);

const light3 = new THREE.PointLight(0xff7733, 1.5, 10);
light3.position.set(3, 2, -1);
scene.add(light3);

// --- Animation & Scroll Logic ---
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
});

// Scroll-triggered rotation/floating
gsap.to(buildingGroup.rotation, {
    y: Math.PI * 0.5,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

gsap.to(buildingGroup.position, {
    y: 2,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Smooth mouse parallax + Base rotation
    buildingGroup.rotation.y += 0.001 + (mouseX - buildingGroup.rotation.y) * 0.05;
    buildingGroup.rotation.x += (mouseY - buildingGroup.rotation.x) * 0.05;

    // Float oscillation
    buildingGroup.position.y += Math.sin(time) * 0.002;

    particleMesh.rotation.y = time * 0.02;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});
