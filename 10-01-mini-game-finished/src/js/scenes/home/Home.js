import * as THREE from 'three';
import { SWorld } from '../../core/World.js';
import { SPhysics } from '../../core/Physics.js';
import { Floor } from '../home/models/Floor.js';
import { Light } from '../home/tools/Light.js';
import { SEventEmitter } from '../../utils/EventEmitter.js';
import { Bird } from './models/Bird.js';
import { Zone } from './models/Zone.js';

export class Home {
  initialized = false;
  raf = 0;

  async init() {
    console.log('init');
    this.world = SWorld;
    this.scene = new THREE.Scene();
    this.world.currentScene = this.scene;

    this.physics = SPhysics;
    this.eventEmitter = SEventEmitter;

    await this.addModels();

    this.initialized = true;
  }

  async addModels() {
    this.floor = new Floor(20, 1, 20, { x: 0, y: 0, z: 0 });
    this.zone = new Zone(2, 1, 2, { x: 7, y: 1, z: 7 });
    this.light = new Light();

    this.scene.add(this.floor, this.zone, this.light);
    await this.addGLTFModels();

    this.models = this.scene.children.filter((child) => child);
    this.physics.add(
      ...this.models.map((model) => model.body).filter((v) => !!v)
    );
  }

  async addGLTFModels() {
    this.bird = new Bird();
    await this.bird.init(3, { x: 0, y: 2, z: 0 });
    this.scene.add(this.bird.instance);
  }

  play() {
    if (!this.initialized) return;

    this.world.update(this.bird.instance, 'far');
    this.physics.update(...this.models);

    this.raf = window.requestAnimationFrame(() => {
      this.play();
    });
  }

  dispose() {
    if (!this.initialized) return;

    const children = [...this.scene.children];
    children.forEach((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
        if (object.body) this.physics.removeBody(object.body);
      }
      this.scene.remove(object);
    });
    window.cancelAnimationFrame(this.raf);

    this.initialized = false;
  }
}
