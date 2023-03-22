import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setClearColor(0x333333, 1);
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
  camera.position.set(5, 7, 5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  const world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.gravity.set(0, -9.82, 0);
  world.allowSleep = true;

  const worldObjects = [];

  const floorMaterial = new CANNON.Material('floor');
  const sphereMaterial = new CANNON.Material('sphere');
  const contactMaterial = new CANNON.ContactMaterial(
    floorMaterial,
    sphereMaterial,
    {
      friction: 0.1,
      restitution: 0.5,
    }
  );
  world.addContactMaterial(contactMaterial);

  setInterval(() => {
    // createSphere();
  }, 500);

  const createLight = () => {
    const light = new THREE.DirectionalLight(0xffffff);
    light.castShadow = true;
    light.position.set(0, 10, 0);

    scene.add(light);
  };

  const createFloor = () => {
    const geometry = new THREE.BoxGeometry(6, 1, 6);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;

    scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(6 / 2, 1 / 2, 6 / 2));
    const body = new CANNON.Body({ shape, material: floorMaterial, mass: 0 });

    world.addBody(body);
    worldObjects.push({ mesh, body });
  };

  const createSphere = () => {
    const material = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const geometry = new THREE.SphereGeometry(0.3, 30, 30);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    scene.add(mesh);

    const shape = new CANNON.Sphere(0.3);
    const body = new CANNON.Body({ shape, material: sphereMaterial, mass: 1 });
    body.position.y = 5;
    body.name = 'sphere';
    world.addBody(body);

    worldObjects.push({ mesh, body });
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
    world.step(1 / 60);

    worldObjects.forEach((worldObject) => {
      if (worldObject.body.name === 'sphere') {
        worldObject.body.applyImpulse(
          new CANNON.Vec3(0.01, 0, 0),
          worldObject.body.position
        );
      }

      worldObject.mesh.position.copy(worldObject.body.position);
      worldObject.mesh.quaternion.copy(worldObject.body.quaternion);
    });

    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = () => {
    createLight();
    createFloor();
    createSphere();
    addEvent();
    resize();
    draw();
  };

  initialize();
}
