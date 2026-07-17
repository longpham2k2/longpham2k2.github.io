/** A single upward triangle. Touching it is fatal. Vertices are public for
 * the CollisionHandler's circle-vs-triangle test. */
export class Spike {
  constructor(context, ax, ay, bx, by, cx, cy) {
    this.context = context;
    this.ax = ax; this.ay = ay; // base-left
    this.bx = bx; this.by = by; // base-right
    this.cx = cx; this.cy = cy; // apex
  }

  draw() {
    const ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(this.ax, this.ay);
    ctx.lineTo(this.bx, this.by);
    ctx.lineTo(this.cx, this.cy);
    ctx.closePath();
    ctx.fillStyle = "#e05b6b";
    ctx.fill();
    ctx.strokeStyle = "#ffb3bd";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

/** Build `count` spikes of width `w` / height `h` standing on a surface. */
export function makeSpikes(context, startX, baseY, count, w, h) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const left = startX + i * w;
    out.push(new Spike(context, left, baseY, left + w, baseY, left + w / 2, baseY - h));
  }
  return out;
}
