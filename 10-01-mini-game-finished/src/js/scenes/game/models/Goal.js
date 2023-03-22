import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { SEventEmitter } from '../../../utils/EventEmitter.js';

export class Goal extends THREE.Mesh {
  name = 'goal';
  body_ = null;

  get body() {
    return this.body_;
  }
  set body(body) {
    this.body_ = body;
  }

  constructor(radius, position) {
    const geometry = new THREE.ConeGeometry(radius, radius, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x08f26e });

    super(geometry, material);

    this.body = new PhysicsGoal(radius, position);
  }
}

class PhysicsGoal extends CANNON.Body {
  name = 'goal';

  constructor(radius, position) {
    const shape = new CANNON.Cylinder(0.1, radius, radius, 12);
    const material = new CANNON.Material();

    super({ shape, material, mass: 0, position });
    this.eventEmitter = SEventEmitter;
    this.eventEmitter.onWin(() => {
      setTimeout(() => {
        this.eventEmitter.clear('win');
        this.eventEmitter.changeScene('home');
      }, 0);
    });
  }
}
