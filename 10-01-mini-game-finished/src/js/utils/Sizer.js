import { SEventEmitter } from './EventEmitter.js';

export class Sizer {
  width_ = 0;
  get width() {
    return this.width_;
  }

  height_ = 0;
  get height() {
    return this.height_;
  }

  constructor() {
    this.width_ = window.innerWidth;
    this.height_ = window.innerHeight;
    this.eventEmitter = SEventEmitter;

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width_ = window.innerWidth;
    this.height_ = window.innerHeight;
    this.eventEmitter.resize();
  }
}
