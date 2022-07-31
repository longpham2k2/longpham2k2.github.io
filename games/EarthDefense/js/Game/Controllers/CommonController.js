export class CommonController {
  constructor() {
    this.time = 0;
    this.score = 0;
    this.level = 0;
  }

  reset() {
    this.time = 0;
    this.score = 0;
    this.level = 0;
  }

  setTime(time) {
    this.time = time;
  }

  getTime() {
    return this.time;
  }

  setScore(score) {
    return this.score = score;
  }
  
  getScore() {
    return this.score;
  }

  setLevel(level) {
    this.level = level;
  }

  getLevel() {
    return this.level;
  }

}