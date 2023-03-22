import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from '../shaders/vertex.glsl?raw';
import fragmentShader from '../shaders/fragment.glsl?raw';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setClearColor(0x333333, 1);

  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();

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
  camera.position.set(0, 0, 1.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const createObject = () => {
    const material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: textureLoader.load('assets/new-beginnings.jpg') },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      glslVersion: THREE.GLSL3,
    });
    const geometry = new THREE.PlaneGeometry(1, 965 / 720, 16, 16);

    const verticesCount = geometry.attributes.position.count;
    const randomPositions = new Float32Array(verticesCount);

    for (let i = 0; i < verticesCount; i++) {
      randomPositions[i] = (Math.random() - 0.5) * 2; // -1 ~ 1
    }

    geometry.setAttribute(
      'aRandomPosition',
      new THREE.BufferAttribute(randomPositions, 1)
    );

    const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.y = 1;
    console.log(mesh.position);

    scene.add(mesh);

    return mesh;
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

  const draw = (mesh) => {
    controls.update();
    renderer.render(scene, camera);

    mesh.material.uniforms.uTime.value = clock.getElapsedTime();

    requestAnimationFrame(() => {
      draw(mesh);
    });
  };

  const initialize = () => {
    const mesh = createObject();
    addEvent();
    resize();
    draw(mesh);
  };

  initialize();
}
