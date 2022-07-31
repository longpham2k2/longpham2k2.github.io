export class Base{
  constructor(context, sprite, preferredScale = 1) {
    this.context = context;
    this.sprite = sprite;
    this.position = {
      x: context.canvas.clientWidth / 2,
      y: context.canvas.clientHeight / 2
    };
    this.size = {
      w: sprite.width * preferredScale,
      h: sprite.height * preferredScale
    }
    this.scale = preferredScale;
    this.a = 0;
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return this.size;
  }

  getAngle() {
    return this.a;
  }

  getScale() {
    return this.scale;
  }

  update() {
    this.a += 1;
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