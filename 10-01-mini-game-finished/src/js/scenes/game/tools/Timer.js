import * as THREE from 'three';
import { SEventEmitter } from '../../../utils/EventEmitter.js';

export class Timer extends THREE.Clock {
  isEnded = false;

  constructor(startAt, timeEl) {
    super();
    this.startAt = startAt;
    this.timeEl = timeEl;
    this.eventEmitter = SEventEmitter;
    this.eventEmitter.onWin(() => {
      this.isEnded = true;
      this.timeEl.textContent = '';
    });
  }

  update() {
    if (this.isEnded) return;

    this.currentTime = Math.max(
      0,
      this.startAt - Math.floor(this.getElapsedTime())
    );
    if (this.timeEl) {
      this.timeEl.textContent = this.currentTime;
    }

    if (this.currentTime === 0) {
      this.isEnded = true;
      this.eventEmitter.lose();
      this.timeEl.textContent = '';
    }
  }
}
