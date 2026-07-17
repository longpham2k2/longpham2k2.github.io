/* One place for the "game feel" knobs. This is the fun file to tinker with:
 * change a number, reload, feel the difference. */
export const PHYSICS = {
  GRAVITY: 0.6,
  MOVE_SPEED: 4.2,
  JUMP_STRENGTH: 14,
  GROUND_ACCEL: 0.6, // how quickly the ball reaches top speed on the ground
  AIR_ACCEL: 0.35,   // reduced control while airborne
  FRICTION: 0.82,    // ground slowdown when no key is held
  COYOTE_FRAMES: 6,  // grace frames to still jump after leaving a ledge
  JUMP_BUFFER: 6,    // remember a jump press this many frames early
};
