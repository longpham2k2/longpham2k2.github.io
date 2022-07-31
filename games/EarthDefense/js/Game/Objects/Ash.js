export class Ash {
  constructor(context, x, y, vx, vy, lifeTime = 100, preferredScale = 1) {
    this.context = context;
    this.position = {
      x: x,
      y: y
    }
    this.size = {
      w: 4 * preferredScale,
      h: 4 * preferredScale
    };
    this.velocity = {
      x: vx, 
      y: vy
    }
    this.lifeTime = 5 * lifeTime;
    this.lifeTime *= Math.random() * 2 + 1;
    this.airResist = 0.97;
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return {
      w: this.sprite.width * this.scale,
      h: this.sprite.height * this.scale
    };
  }

  getVelocity() {
    return this.velocity;
  }

  getAngle() {
    return this.a;
  }

  isExpired() {
    return this.lifeTime <= 0;
  }
  
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.airResist;
    this.velocity.y *= this.airResist;
    this.lifeTime -= 1;
  }

  draw() {
    this.context.save();
    this.context.fillStyle = "rgb(255, 255, 255)";
    this.context.fillRect(
      this.position.x - this.size.w / 2, 
      this.position.y - this.size.h / 2, 
      this.size.w, 
      this.size.h
    );
    this.context.restore();
  }

}