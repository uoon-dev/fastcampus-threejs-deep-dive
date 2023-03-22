import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import gsap from 'gsap';

export class Barricade extends THREE.Mesh {
  name = 'barricade';
  body_ = null;

  get body() {
    return this.body_;
  }
  set body(body) {
    this.body_ = body;
  }

  constructor(width, height, depth, position) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: 0x964b00 });

    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = false;
    this.body = new PhysicsBarricade(width, height, depth, position);
  }
}

export class PhysicsBarricade extends CANNON.Body {
  name = 'barricade';
  originX = 0;

  constructor(width, height, depth, position) {
    const duration = Math.random() * 2 + 0.5;
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        width / 2 + (0.2 / duration) * (width / 2),
        height / 2,
        depth / 2
      )
    );
    const material = new CANNON.Material();

    super({ shape, material, mass: 0, position });

    this.originX = position.x;
    this.update(duration);
  }

  update(duration) {
    this.anime = gsap.to(this.position, {
      duration,
      x: -this.originX,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  reset() {
    this.anime.kill();
  }
}
