/* Copied from the Earth Defense engine. Tracks shared run state; for Spike
 * Roller we use `time` (the run timer) and `deaths`. */
export class CommonController {
  constructor() {
    this.time = 0;
    this.deaths = 0;
  }

  reset() {
    this.time = 0;
    this.deaths = 0;
  }

  setTime(time) {
    this.time = time;
  }

  getTime() {
    return this.time;
  }

  addDeath() {
    this.deaths += 1;
  }

  getDeaths() {
    return this.deaths;
  }
}
