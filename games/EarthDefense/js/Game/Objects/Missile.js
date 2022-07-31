export class Missile {
  constructor(context, sprite, x, y, vx, vy, a, preferredScale = 1) {
    this.context = context;
    this.sprite = sprite;
    this.size = {
      w: sprite.width * preferredScale,
      h: sprite.height * preferredScale
    };
    this.position = {
      x: x,
      y: y
    };
    this.velocity = {
      x: vx,
      y: vy
    }
    this.scale = preferredScale;
    this.a = a;
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return this.size;
  }

  getVelocity() {
    return this.velocity;
  }

  getScale() {
    return this.scale;
  }

  getAngle() {
    return this.a;
  }

  update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  }

  draw() {
    this.context.save();
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.a / 180 * Math.PI);
    this.context.drawImage(
      this.sprite,
      -this.size.w / 2,
      -this.size.h / 2,
      this.size.w,
      this.size.h    
    );
    this.context.restore();
  }
  
}