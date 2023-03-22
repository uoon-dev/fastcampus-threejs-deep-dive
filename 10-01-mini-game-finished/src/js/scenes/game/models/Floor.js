import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Floor extends THREE.Mesh {
  name = 'floor';
  body_ = null;

  get body() {
    return this.body_;
  }
  set body(body) {
    this.body_ = body;
  }

  constructor(width, height, depth, position) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    super(geometry, material);
    this.body = new PhysicsFloor(width, height, depth, position);
    this.receiveShadow = true;
  }
}

class PhysicsFloor extends CANNON.Body {
  name = 'floor';

  constructor(width, height, depth, position) {
    const shape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    const material = new CANNON.Material({ friction: 0.1, restitution: 0.5 });

    super({ shape, material, mass: 0, position });
  }
}
