/** The flag at the end of the level. Reaching its box wins the run. */
export class Goal {
  constructor(context, x, y, w = 16, h = 80) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(reached = false) {
    const ctx = this.context;
    ctx.fillStyle = "#8a8f9c"; // pole
    ctx.fillRect(this.x, this.y, 4, this.h);
    ctx.fillStyle = reached ? "#6ee7a8" : "#ffd166"; // flag turns green on win
    ctx.beginPath();
    ctx.moveTo(this.x + 4, this.y);
    ctx.lineTo(this.x + 4 + this.w, this.y + 12);
    ctx.lineTo(this.x + 4, this.y + 24);
    ctx.closePath();
    ctx.fill();
  }
}
