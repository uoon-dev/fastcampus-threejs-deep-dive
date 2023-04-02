import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import dat from 'dat.gui';
import monitorDisplayVertexShader from '../shaders/vertex.glsl?raw';
import monitorDisplayFragmentShader from '../shaders/fragment.glsl?raw';

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

  const gui = new dat.GUI();
  const scene = new THREE.Scene();
  const aspect = canvasSize.width / canvasSize.height;
  const viewSize = 5;

  const camera = new THREE.OrthographicCamera(
    -(aspect * viewSize) / 2,
    (aspect * viewSize) / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1,
    100
  );
  camera.position.set(-2.89, 2.53, 2.75);

  gui.add(camera.position, 'x').min(-10).max(10).step(0.01).name('cameraX');
  gui.add(camera.position, 'y').min(-10).max(10).step(0.01).name('cameraY');
  gui.add(camera.position, 'z').min(-10).max(10).step(0.01).name('cameraZ');

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('assets/draco/');

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const createObject = () => {
    gltfLoader.load('assets/home-modeling.glb', (gltf) => {
      gltf.scene.scale.set(0.25, 0.25, 0.25);
      gltf.scene.position.set(0, -1, 0);
      scene.add(gltf.scene);

      scene.traverse((child) => {
        if (child.name === 'stand') {
          const pointLight = new THREE.PointLight(0xffff00, 0.5);
          pointLight.scale.set(0.001, 0.001, 0.001);

          // const pointLightHelper = new THREE.PointLightHelper(pointLight, 100);
          pointLight.position.set(
            child.position.x * 0.25,
            child.position.y * 0.25 - 0.2,
            child.position.z * 0.25
          );

          scene.add(pointLight);
          // scene.add(pointLightHelper);
        }

        if (child.name === 'monitorDisplay') {
          child.material = new THREE.ShaderMaterial({
            vertexShader: monitorDisplayVertexShader,
            fragmentShader: monitorDisplayFragmentShader,
          });
        }

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

    directionalLight.position.set(-2.89, 3.62, 4.27);
    gui
      .add(directionalLight.position, 'x')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('lightX');
    gui
      .add(directionalLight.position, 'y')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('lightY');
    gui
      .add(directionalLight.position, 'z')
      .min(-10)
      .max(10)
      .step(0.01)
      .name('lightZ');

    scene.add(directionalLight);
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    const aspect = canvasSize.width / canvasSize.height;
    camera.left = -(aspect * viewSize) / 2;
    camera.right = (aspect * viewSize) / 2;
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
