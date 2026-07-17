import { PHYSICS } from "../config.js";

/**
 * The ball. Follows the engine's object convention (getPosition/getSize/
 * getAngle + update + draw). It owns gravity + integration; the
 * LevelController drives input, jumping and collision resolution.
 */
export class Player {
  constructor(context, x, y, r = 16) {
    this.context = context;
    this.r = r;
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.angle = 0;      // visual roll
    this.squash = 1;     // 1 = round; dips on landing for a bit of juice
    this.onGround = false;
    this.coyote = 0;     // frames of "still allowed to jump"
    this.jumpBuffer = 0; // frames a jump press stays queued
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return { w: this.r * 2, h: this.r * 2 };
  }

  getAngle() {
    return this.angle;
  }

  update(dt) {
    this.velocity.y += PHYSICS.GRAVITY * dt;
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    this.angle += (this.velocity.x * dt) / this.r;      // roll with movement
    this.squash += (1 - this.squash) * 0.2 * dt;        // ease back to round
  }

  draw() {
    const ctx = this.context;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.scale(1 / this.squash, this.squash); // vertical squash on landing
    ctx.rotate(this.angle);

    // Body.
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "#4ec9e0";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#bff2ff";
    ctx.stroke();

    // Stripe + dot so the roll is visible.
    ctx.strokeStyle = "#2b7d8f";
    ctx.beginPath();
    ctx.moveTo(-this.r, 0);
    ctx.lineTo(this.r, 0);
    ctx.stroke();
    ctx.fillStyle = "#2b7d8f";
    ctx.beginPath();
    ctx.arc(this.r * 0.45, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
