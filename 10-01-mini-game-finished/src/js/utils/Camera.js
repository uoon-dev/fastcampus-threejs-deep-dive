import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Camera extends THREE.PerspectiveCamera {
  get sizer() {
    return this.world.sizer;
  }

  constructor(world) {
    super(75, world.sizer.width / world.sizer.height, 0.1, 100);
    this.world = world;
    this.domElement = this.world.domElement;
    this.position.set(0, 20, 15);
    this.rotation.x = -Math.PI / 3;
  }

  resize() {
    this.aspect = this.sizer.width / this.sizer.height;
    this.updateProjectionMatrix();
  }

  update({ position }, mode) {
    if (!position) return;

    switch (mode) {
      case 'near': {
        this.rotation.x = -0.6;
        this.position.set(position.x, position.y + 2, position.z + 2.3);
        break;
      }
      case 'far': {
        this.rotation.x = -Math.PI / 3;
        this.position.set(position.x, position.y + 20, position.z + 15);
        break;
      }
    }
  }
}
