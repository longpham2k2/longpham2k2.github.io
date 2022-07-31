export class Button {
  constructor(context, sprite, x, y, a = 0, preferredWidth = sprite.width, preferredHeight = sprite.height) {
    this.context = context;        
    this.sprite = sprite;
    this.position = {
      x: x,
      y: y
    };
    this.size = {
      w: preferredWidth,
      h: preferredHeight
    };
    this.a = a;
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return this.size;
  }

  changeSprite(sprite) {
    this.sprite = sprite;
  }

  update() {

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