/**
 * Collision for a ball platformer. Same "Handler" slot as the Earth Defense
 * engine, but the ball wants circle math instead of the old SAT rectangles:
 *   - circle vs axis-aligned rectangle (platforms), with resolution
 *   - circle vs triangle (spikes), boolean only
 */
export class CollisionHandler {
  /**
   * Push `ball` out of `rect` and cancel the velocity heading into the surface.
   * `ball` needs { position:{x,y}, r, velocity:{x,y} }; `rect` is { x, y, w, h }.
   * @returns {boolean} true if the ball is resting on top of this rectangle.
   */
  resolveRect(ball, rect) {
    const nearestX = clamp(ball.position.x, rect.x, rect.x + rect.w);
    const nearestY = clamp(ball.position.y, rect.y, rect.y + rect.h);
    const dx = ball.position.x - nearestX;
    const dy = ball.position.y - nearestY;
    const dist2 = dx * dx + dy * dy;
    if (dist2 >= ball.r * ball.r) return false;

    let nx, ny, penetration;
    if (dist2 > 0.0001) {
      const dist = Math.sqrt(dist2);
      nx = dx / dist;
      ny = dy / dist;
      penetration = ball.r - dist;
    } else {
      // Center inside the rect — push out along the shallowest side.
      const left = ball.position.x - rect.x;
      const right = rect.x + rect.w - ball.position.x;
      const top = ball.position.y - rect.y;
      const bottom = rect.y + rect.h - ball.position.y;
      const min = Math.min(left, right, top, bottom);
      if (min === top)         { nx = 0; ny = -1; }
      else if (min === bottom) { nx = 0; ny = 1; }
      else if (min === left)   { nx = -1; ny = 0; }
      else                     { nx = 1; ny = 0; }
      penetration = min + ball.r;
    }

    ball.position.x += nx * penetration;
    ball.position.y += ny * penetration;

    const into = ball.velocity.x * nx + ball.velocity.y * ny;
    if (into < 0) {
      ball.velocity.x -= into * nx;
      ball.velocity.y -= into * ny;
    }
    return ny < -0.7; // normal points up → standing on this platform
  }

  /** True if the ball overlaps the spike triangle. `tri` = { ax,ay,bx,by,cx,cy }. */
  hitsTriangle(ball, tri) {
    const cx = ball.position.x;
    const cy = ball.position.y;
    const r2 = ball.r * ball.r;

    if (dist2(cx, cy, tri.ax, tri.ay) < r2) return true;
    if (dist2(cx, cy, tri.bx, tri.by) < r2) return true;
    if (dist2(cx, cy, tri.cx, tri.cy) < r2) return true;
    if (pointInTriangle(cx, cy, tri)) return true;
    if (segDist2(cx, cy, tri.ax, tri.ay, tri.bx, tri.by) < r2) return true;
    if (segDist2(cx, cy, tri.bx, tri.by, tri.cx, tri.cy) < r2) return true;
    if (segDist2(cx, cy, tri.cx, tri.cy, tri.ax, tri.ay) < r2) return true;
    return false;
  }
}

/* ---- module-level math helpers (same pattern as the engine's file) ------- */
function pointInTriangle(px, py, t) {
  const d1 = sign(px, py, t.ax, t.ay, t.bx, t.by);
  const d2 = sign(px, py, t.bx, t.by, t.cx, t.cy);
  const d3 = sign(px, py, t.cx, t.cy, t.ax, t.ay);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

const sign = (px, py, ax, ay, bx, by) => (px - bx) * (ay - by) - (ax - bx) * (py - by);

function segDist2(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - x1) * dx + (py - y1) * dy) / len2 : 0;
  t = clamp(t, 0, 1);
  return dist2(px, py, x1 + t * dx, y1 + t * dy);
}

const dist2 = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
