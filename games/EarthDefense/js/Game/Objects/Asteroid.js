export class Asteroid {
  constructor(context, sprite, x, y, vx, vy, a, preferredScale = 1) {
    this.context = context;
    this.sprite = sprite;
    this.position = {
      x: x,
      y: y
    };
    this.scale = preferredScale;
    this.velocity = {
      x: vx,
      y: vy
    }
    this.da = 15 * (Math.random() - 0.5); 
    this.a = a;
  }

  getSprite() {
    return this.sprite;
  }

  getPosition() {
    return this.position;
  }

  getVelocity() {
    return this.velocity;
  }

  getSize() {
    return {
      w: this.sprite.width * this.scale,
      h: this.sprite.height * this.scale
    };
  }

  getScale() {
    return this.scale;
  }

  getAngle() {
    return this.a;
  }

  setPosition(x = 1, y = 1) {
    this.position.x = x;
    this.position.y = y;
  }

  setVelocity(vx = 1, vy = 1) {
    this.velocity.x = vx;
    this.velocity.y = vy;
  }

  setScale(scale = 1) {
    this.scale = scale;
  }

  setAngle(angle = 0) {
    this.a = angle;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.a += this.da;
  }

  draw() {
    let expectedSize = this.getSize();
    this.context.save();
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.a / 180 * Math.PI);
    this.context.drawImage(
      this.sprite,
      -expectedSize.w / 2,
      -expectedSize.h / 2,
      expectedSize.w,
      expectedSize.h    
    );
    this.context.restore();
  }
  
}