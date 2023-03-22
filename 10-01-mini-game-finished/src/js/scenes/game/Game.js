import * as THREE from 'three';
import { SWorld } from '../../core/World.js';
import { SPhysics } from '../../core/Physics.js';
import { Floor } from '../game/models/Floor.js';
import { Player } from '../game/models/Player.js';
import { Light } from '../game/tools/Light.js';
import { Barricade } from './models/Barricade.js';
import { Roller } from './models/Roller.js';
import { Goal } from './models/Goal.js';
import { Timer } from './tools/Timer.js';
import { SEventEmitter } from '../../utils/EventEmitter.js';

export class Game {
  initialized = false;
  raf = 0;

  init() {
    this.timer = new Timer(15, document.querySelector('.time h1'));
    this.world = SWorld;
    this.scene = new THREE.Scene();
    this.world.currentScene = this.scene;

    this.physics = SPhysics;
    this.eventEmitter = SEventEmitter;

    this.addModels();
    this.eventEmitter.onLose(() => this.reset());
    this.initialized = true;
  }

  addModels() {
    this.player = new Player(0.3, { x: 0, y: 3, z: 9 });
    this.floor1 = new Floor(5, 1, 20, { x: 0, y: 0, z: 0 });
    this.floor2 = new Floor(5, 1, 15, { x: 0, y: 0, z: -20 });
    this.floor3 = new Floor(5, 1, 7, { x: 0, y: 0, z: -35 });
    this.barricade1 = new Barricade(1.5, 1.5, 0.5, { x: -1.5, y: 1.4, z: 3 });
    this.barricade2 = new Barricade(1.5, 1.5, 0.5, { x: 2, y: 1.4, z: -2 });
    this.roller = new Roller(0.3, 0.3, 4, { x: 0, y: 1, z: -17 });
    this.goal = new Goal(1, { x: 0, y: 1, z: -35 });
    this.light = new Light();

    this.scene.add(
      this.player,
      this.floor1,
      this.floor2,
      this.floor3,
      this.light,
      this.light.target,
      this.barricade1,
      this.barricade2,
      this.roller,
      this.goal
      // new THREE.CameraHelper(this.light.shadow.camera)
    );
    this.models = this.scene.children.filter((child) => child.isMesh);
    this.physics.add(
      ...this.models.map((model) => model.body).filter((v) => !!v)
    );
  }

  play() {
    if (!this.initialized) return;

    this.timer.update();
    this.world.update(this.player, 'near');
    this.light.update(this.world.camera);
    this.physics.update(...this.models);

    this.raf = window.requestAnimationFrame(() => {
      this.play();
    });
  }

  reset() {
    this.timer.stop();
    this.models.forEach((model) => model.body.reset?.());
  }

  dispose() {
    if (!this.initialized) return;
    this.reset();
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
