import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl?raw';
import fragmentShader from '../shaders/fragment.glsl?raw';
import ASScroll from '@ashthornton/asscroll';

const asscroll = new ASScroll({
  disableRaf: true,
});
asscroll.enable();

export default function () {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });

  const container = document.querySelector('#container');

  container.appendChild(renderer.domElement);

  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const textureLoader = new THREE.TextureLoader();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasSize.width / canvasSize.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 50);
  camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;

  const imageRepository = [];

  const loadImages = async () => {
    const images = [...document.querySelectorAll('main .content img')];

    const fetchImages = images.map(
      (image) =>
        new Promise((resolve, reject) => {
          image.onload = resolve(image);
          image.onerror = reject;
        })
    );

    const loadedImages = await Promise.all(fetchImages);

    return loadedImages;
  };

  const createImages = (images) => {
    console.log('createImages', images);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: null,
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
    });

    const imageMeshes = images.map((image) => {
      const { width, height } = image.getBoundingClientRect();
      const clonedMaterial = material.clone();
      clonedMaterial.uniforms.uTexture.value = textureLoader.load(image.src);

      const geometry = new THREE.PlaneGeometry(width, height, 16, 16);
      const mesh = new THREE.Mesh(geometry, clonedMaterial);

      imageRepository.push({ img: image, mesh });

      return mesh;
    });

    return imageMeshes;
  };

  const create = async () => {
    const loadedImages = await loadImages();
    const images = createImages([...loadedImages]);
    console.log(images);
    scene.add(...images);
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const retransform = () => {
    imageRepository.forEach(({ img, mesh }) => {
      const { width, height, top, left } = img.getBoundingClientRect();
      const { width: originWidth } = mesh.geometry.parameters;

      const scale = width / originWidth;
      mesh.scale.x = scale;
      mesh.scale.y = scale;

      mesh.position.y = canvasSize.height / 2 - height / 2 - top;
      mesh.position.x = -canvasSize.width / 2 + width / 2 + left;
    });
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = () => {
    renderer.render(scene, camera);
    retransform();

    asscroll.update();

    requestAnimationFrame(() => {
      draw();
    });
  };

  const initialize = async () => {
    await create();
    addEvent();
    resize();
    draw();
  };

  initialize().then();
}
