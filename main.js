import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Texture } from "three";

// Setup

const scene = new THREE.Scene();

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Saturn Texture
const saturnTexture = new THREE.TextureLoader().load("8k_saturn.jpg");
const saturnNormalTexture = new THREE.TextureLoader().load("file.jpg");

// Saturn Mesh
const saturnPlanet = new THREE.Mesh(
  new THREE.SphereGeometry(5),
  new THREE.MeshPhongMaterial({
    map: saturnTexture,
    normalMap: saturnNormalTexture,
  })
);

// Saturn Ring Texture
const saturnRingTexture = new THREE.TextureLoader().load("saturn_ring.png");

const geometry = new THREE.RingBufferGeometry(6, 10, 64);
var pos = geometry.attributes.position;
var v3 = new THREE.Vector3();
for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    geometry.attributes.uv.setXY(i, v3.length() < 7 ? 0 : 1, 1);
}

const material = new THREE.MeshLambertMaterial({
    map: saturnRingTexture,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
});
const saturnRing = new THREE.Mesh(geometry, material);

scene.add(saturnPlanet);
scene.add(saturnRing);

// Saturn Controls
saturnPlanet.position.set(0, 0, -10);
saturnRing.position.set(0, 0, -10);
saturnRing.rotation.set(1, 2, 3);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, -10);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  //   saturnPlanet.rotation.x += 0.01;
  saturnPlanet.rotation.y += 0.005;
  saturnPlanet.rotation.z += 0.0001;

  moon.rotation.x += 0.005;

  //   controls.update();

  renderer.render(scene, camera);
}

animate();
