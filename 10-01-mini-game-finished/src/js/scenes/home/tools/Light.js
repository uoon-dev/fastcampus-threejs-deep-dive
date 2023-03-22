import * as THREE from 'three';

export class Light extends THREE.DirectionalLight {
  constructor() {
    super(0xffffff);
    this.position.set(0, 5, 0);
    this.castShadow = true;
    this.shadow.mapSize.width = 2048;
    this.shadow.mapSize.height = 2048;
  }
}
