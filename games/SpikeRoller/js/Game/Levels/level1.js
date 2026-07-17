import { Platform } from "../Objects/Platform.js";
import { Goal } from "../Objects/Goal.js";
import { makeSpikes } from "../Objects/Spike.js";

const GROUND_TOP = 480;

/**
 * A level is just data: where the ball starts, how wide the world is, and the
 * platforms / spikes / goal that fill it. Build a whole level by editing this.
 * @param {CanvasRenderingContext2D} ctx passed so objects can draw themselves
 */
export function buildLevel1(ctx) {
  const platforms = [
    new Platform(ctx, 0, 480, 560, 60),    // start ground
    new Platform(ctx, 720, 480, 520, 60),  // ground B  (pit before it: 560-720)
    new Platform(ctx, 900, 370, 160, 20),  // hop-over platform above the spikes
    new Platform(ctx, 1400, 480, 520, 60), // ground C  (pit before it: 1240-1400)
    new Platform(ctx, 1560, 400, 120, 20), // stair 1
    new Platform(ctx, 1740, 330, 120, 20), // stair 2
    new Platform(ctx, 2080, 480, 920, 60), // final ground (pit before it: 1920-2080)
  ];

  const spikes = [
    ...makeSpikes(ctx, 900, GROUND_TOP, 5, 28, 30),   // guard the pit on ground B
    ...makeSpikes(ctx, 1560, GROUND_TOP, 10, 30, 30), // field crossed via the stairs
    ...makeSpikes(ctx, 2600, GROUND_TOP, 4, 28, 32),  // last hurdle before the flag
  ];

  const goal = new Goal(ctx, 2860, 400, 16, 80);

  return {
    spawn: { x: 80, y: 430 },
    width: 3000,
    platforms,
    spikes,
    goal,
  };
}
