/** A solid rectangle the ball stands on. Exposes x/y/w/h for collision. */
export class Platform {
  constructor(context, x, y, w, h) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    const ctx = this.context;
    ctx.fillStyle = "#3a3f5c";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "#5a6a8c"; // lit top edge
    ctx.fillRect(this.x, this.y, this.w, 5);
  }
}
