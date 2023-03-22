import EventEmitter3 from 'eventemitter3';

export class EventEmitter {
  eventEmitter = new EventEmitter3();

  resize() {
    this.eventEmitter.emit('resize');
  }

  onResize(callbackFn) {
    this.eventEmitter.on('resize', callbackFn);
  }

  lose() {
    this.eventEmitter.emit('lose');
  }

  onLose(callbackFn) {
    this.eventEmitter.on('lose', callbackFn);
  }

  win() {
    this.eventEmitter.emit('win');
  }

  onWin(callbackFn) {
    this.eventEmitter.on('win', callbackFn);
  }

  enter() {
    this.eventEmitter.emit('enter');
  }

  onEnter(callbackFn) {
    this.eventEmitter.on('enter', callbackFn);
  }

  changeScene(scene) {
    this.eventEmitter.emit('changeScene', scene);
  }

  onChangeScene(callbackFn) {
    this.eventEmitter.on('changeScene', callbackFn);
  }

  clear(event) {
    this.eventEmitter.removeListener(event);
  }
}

export const SEventEmitter = new EventEmitter();
