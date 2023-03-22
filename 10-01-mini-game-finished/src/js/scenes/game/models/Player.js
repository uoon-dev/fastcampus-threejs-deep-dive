import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SPhysics } from '../../../core/Physics.js';
import { SEventEmitter } from '../../../utils/EventEmitter.js';

export class Player extends THREE.Mesh {
  name = 'player';
  body_ = null;
  get body() {
    return this.body_;
  }
  set body(body) {
    this.body_ = body;
  }

  constructor(radius, position) {
    const geometry = new THREE.SphereGeometry(radius, 30, 30);
    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });

    super(geometry, material);
    this.body = new PhysicsPlayer(radius, position);
    this.castShadow = true;
    this.receiveShadow = false;
  }
}

class PhysicsPlayer extends CANNON.Body {
  name = 'player';
  isReset = false;

  constructor(radius, position) {
    const shape = new CANNON.Sphere(radius);
    const material = new CANNON.Material({ friction: 0.1, restitution: 0.5 });

    super({ shape, material, mass: 10, position });
    this.physics = SPhysics;
    this.eventEmitter = SEventEmitter;

    this.addKeydownEvent();
  }

  addKeydownEvent() {
    let isArrowUpPressed = false;
    let isArrowDownPressed = false;
    let isArrowLeftPressed = false;
    let isArrowRightPressed = false;
    let isSpacePressed = false;
    let isLanded = false;

    window.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowUp') isArrowUpPressed = true;
      if (event.code === 'ArrowDown') isArrowDownPressed = true;
      if (event.code === 'ArrowLeft') isArrowLeftPressed = true;
      if (event.code === 'ArrowRight') isArrowRightPressed = true;
      if (event.code === 'Space' && isLanded) isSpacePressed = true;
    });

    window.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowUp') isArrowUpPressed = false;
      if (event.code === 'ArrowDown') isArrowDownPressed = false;
      if (event.code === 'ArrowLeft') isArrowLeftPressed = false;
      if (event.code === 'ArrowRight') isArrowRightPressed = false;
      if (event.code === 'Space') isSpacePressed = false;
    });

    this.physics.addEventListener('postStep', () => {
      if (this.isReset) return;

      const x = isArrowLeftPressed ? -1 : isArrowRightPressed ? 1 : 0;
      const y = isSpacePressed && isLanded ? 50 : 0;
      const z = isArrowUpPressed ? -1 : isArrowDownPressed ? 1 : 0;

      if (isSpacePressed) isLanded = false;

      this.applyImpulse(new CANNON.Vec3(x, y, z));
    });

    this.addEventListener('collide', (event) => {
      if (event.body.name === 'floor') {
        isLanded = true;
      }

      if (event.body.name === 'goal') {
        this.eventEmitter.win();
      }
    });
  }

  reset() {
    this.position.copy(this.initPosition);
    this.mass = 0;
    this.velocity.set(0, 0, 0);
    this.isReset = true;
  }
}
