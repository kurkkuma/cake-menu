import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xebe3d5);

const divWidth = document.querySelector(".main-container");
let size = divWidth.offsetWidth / 2.5;

const canvas = document.createElement("canvas");
const div = document.querySelector(".canvas-container-1");

const sizes = {
  width: size,
  height: size,
};
window.addEventListener("resize", () => {
  size = divWidth.offsetWidth / 2.5;
  sizes.width = size;
  sizes.height = size;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let model = null;

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "static/chocolate-cake/scene.gltf",
  (gltf) => {
    gltf.scene.scale.set(24, 24, 24);
    gltf.scene.position.y = 0.5;
    gltf.scene.position.x = -0.2;

    model = gltf.scene;
    scene.add(model);

    const loader = document.querySelector(".spinner-1");
    if (loader) {
      loader.remove();
    }
    div.appendChild(canvas);
  },
  () => {}
);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.set(0, 2, 2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  if (model) {
    model.rotation.y = elapsedTime / 4;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
