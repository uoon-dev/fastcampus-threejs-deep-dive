import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import dat from 'dat.gui';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x333333);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const gltfLoader = new GLTFLoader();
  const gui = new dat.GUI();

  const createObject = () => {
    gltfLoader.load('assets/desk-modeling.glb', (gltf) => {
      gltf.scene.scale.set(0.25, 0.25, 0.25);
      scene.add(gltf.scene);

      scene.traverse((child) => {
        if (
          child.isMesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    });
  };

  const createLight = () => {
    const directionalLight = new THREE.DirectionalLight('0xffffff', 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.normalBias = 0.05;

    directionalLight.position.set(2, 2, 2);
    gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.01);
    gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.01);
    gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.01);

    scene.add(directionalLight);
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = () => {
    createLight();
    createObject();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
