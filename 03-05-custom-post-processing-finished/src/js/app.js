import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { convertLatLngToPos, getGradientCanvas } from './utils.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import dat from 'dat.gui';

export default function () {
  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  const renderTarget = new THREE.WebGLRenderTarget(
    canvasSize.width,
    canvasSize.height,
    {
      samples: 2,
    }
  );

  const effectComposer = new EffectComposer(renderer, renderTarget);
  const textureLoader = new THREE.TextureLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const environmentMap = cubeTextureLoader.load([
    'assets/environments/px.png',
    'assets/environments/nx.png',
    'assets/environments/py.png',
    'assets/environments/ny.png',
    'assets/environments/pz.png',
    'assets/environments/nz.png',
  ]);

  environmentMap.encoding = THREE.sRGBEncoding;

  const container = document.querySelector('#container');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = environmentMap;
  scene.environment = environmentMap;

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

  const gui = new dat.GUI();

  const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(2.65, 2.13, 1.02);

    scene.add(light);
  };

  const addPostEffects = (obj) => {
    const { earthGroup } = obj;

    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    const filmPass = new FilmPass(1, 1, 4096, false);
    // effectComposer.addPass(filmPass);

    const shaderPass = new ShaderPass(GammaCorrectionShader);
    const customShaderPass = new ShaderPass({
      uniforms: {
        uBrightness: { value: 1 },
        uPosition: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Vector3(0, 0, 0.3) },
        uAlpha: { value: 0.5 },
        tDiffuse: { value: null },
      },
      vertexShader: `
        varying vec2 vPosition;
        varying vec2 vUv;

        void main() {
          gl_Position = vec4(position.x, position.y, 0.0, 1.0);
          vPosition = position.xy;
          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform float uBrightness;
        uniform vec2 uPosition;
        uniform vec3 uColor;
        uniform float uAlpha;
        uniform sampler2D tDiffuse;

        varying vec2 vPosition;
        varying vec2 vUv;
    
        void main() {
          vec2 newUV = vec2(vUv.x, vUv.y + sin(vUv.x * 20.0) * 0.1);
          vec4 tex = texture2D(tDiffuse, newUV);
          tex.rgb += uColor;
          float brightness = sin(uBrightness + vUv.x);

          gl_FragColor = tex / brightness;
        }
      `,
    });
    gui.add(customShaderPass.uniforms.uPosition.value, 'x', -1, 1, 0.01);
    gui.add(customShaderPass.uniforms.uPosition.value, 'y', -1, 1, 0.01);
    gui
    .add(customShaderPass.uniforms.uBrightness, 'value', 0, 1, 0.01)
    .name('brightness');

    effectComposer.addPass(customShaderPass);

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvasSize.width, canvasSize.height)
    );
    // unrealBloomPass.strength = 1;
    // unrealBloomPass.threshold = 0.1;
    // unrealBloomPass.radius = 1;
    // effectComposer.addPass(unrealBloomPass);
    effectComposer.addPass(shaderPass);

    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);
  };

  const createEarth1 = () => {
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('assets/earth-night-map.jpg'),
      side: THREE.FrontSide,
      opacity: 0.6,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(1.3, 30, 30);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = -Math.PI / 2;

    return mesh;
  };

  const createEarth2 = () => {
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('assets/earth-night-map.jpg'),
      opacity: 0.9,
      transparent: true,
      side: THREE.BackSide,
    });

    const geometry = new THREE.SphereGeometry(1.5, 30, 30);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = -Math.PI / 2;

    return mesh;
  };

  const createStar = (count = 500) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i] = (Math.random() - 0.5) * 5; // -3~3
      positions[i + 1] = (Math.random() - 0.5) * 5; // -3~3
      positions[i + 2] = (Math.random() - 0.5) * 5; // -3~3
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.01,
      transparent: true,
      depthWrite: false,
      map: textureLoader.load('assets/particle.png'),
      alphaMap: textureLoader.load('assets/particle.png'),
      color: 0xbcc6c6,
    });

    const star = new THREE.Points(particleGeometry, particleMaterial);

    return star;
  };

  const createPoint1 = () => {
    const point = {
      lat: 37.56668 * (Math.PI / 180),
      lng: 126.97841 * (Math.PI / 180),
    };

    const position = convertLatLngToPos(point, 1.3);

    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.02, 0.002, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x263d64 })
    );

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(0.9, 2.46, 1);

    return mesh;
  };

  const createPoint2 = () => {
    const point = {
      lat: 5.55363 * (Math.PI / 180),
      lng: -0.196481 * (Math.PI / 180),
    };

    const position = convertLatLngToPos(point, 1.3);

    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.02, 0.002, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x263d64 })
    );

    mesh.position.set(position.x, position.y, position.z);

    return mesh;
  };

  const createCurve = (pos1, pos2) => {
    const points = [];

    for (let i = 0; i <= 100; i++) {
      const pos = new THREE.Vector3().lerpVectors(pos1, pos2, i / 100);
      pos.normalize();

      const wave = Math.sin((Math.PI * i) / 100);

      pos.multiplyScalar(1.3 + 0.4 * wave);

      points.push(pos);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 20, 0.003);

    const graidentCanvas = getGradientCanvas('#757F94', '#263D74');
    const texture = new THREE.CanvasTexture(graidentCanvas);

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  };

  const create = () => {
    const earthGroup = new THREE.Group();

    const earth1 = createEarth1();
    const earth2 = createEarth2();
    const star = createStar();
    const point1 = createPoint1();
    const point2 = createPoint2();
    const curve = createCurve(point1.position, point2.position);

    earthGroup.add(earth1, earth2, point1, point2, curve);

    scene.add(earthGroup, star);

    return {
      earthGroup,
      star,
    };
  };

  const resize = () => {
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerHeight;

    camera.aspect = canvasSize.width / canvasSize.height;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer.setSize(canvasSize.width, canvasSize.height);
  };

  const addEvent = () => {
    window.addEventListener('resize', resize);
  };

  const draw = (obj) => {
    const { earthGroup, star } = obj;
    earthGroup.rotation.x += 0.0005;
    earthGroup.rotation.y += 0.0005;

    star.rotation.x += 0.001;
    star.rotation.y += 0.001;

    controls.update();
    effectComposer.render();
    // renderer.render(scene, camera);
    requestAnimationFrame(() => {
      draw(obj);
    });
  };

  const initialize = () => {
    const obj = create();

    addLight();
    addPostEffects(obj);
    addEvent();
    resize();
    draw(obj);
  };

  initialize();
}
