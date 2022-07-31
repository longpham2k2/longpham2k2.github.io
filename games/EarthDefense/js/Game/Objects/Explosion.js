import { Ash } from "./Ash.js";

export class Explosion {
  constructor(context, source, expectedLifeTime = 100) {
    this.context = context;
    this.ashes = [];
    this.expectedLifeTime = expectedLifeTime;
    this.init(source);
  }

  init(source) {
    let sourceScale = source.getScale();
    let num = 5 + Math.floor(Math.random() * sourceScale * 10);
    for (let i = 0; i < num; i++) {
      let sourcePosition = Object.assign({}, source.getPosition());
      let sourceVelocity = Object.assign({}, source.getVelocity());
      let x = sourcePosition.x;
      let y = sourcePosition.y;
      let vx = 2 * sourceVelocity.x * (Math.random() - 0.2);
      vx += 3 * (Math.random() - 0.5);
      let vy = 2 * sourceVelocity.y * (Math.random() - 0.2);
      vy += 3 * (Math.random() - 0.5);
      let scale = Math.floor(Math.random() * sourceScale * 10);
      let a = new Ash(this.context, x, y, vx, -vy, this.expectedLifeTime, sourceScale);
      this.ashes.push(a);
    }
  }

  isExpired() {
    return this.ashes.length <= 0;
  }
  
  update() {
    this.ashes.forEach((ash, ashIndex) => {
      if (ash.isExpired()) {
        this.ashes.splice(ashIndex, 1);
      }
      else {
        ash.update();
      }
    });
  }

  draw() {
    this.ashes.forEach((ash) => ash.draw());
  }

}