/* Copied from the engine you built for Earth Defense, now living in this
 * game so we can improve them on the go. */
import { InputHandler } from "./Handlers/InputHandler.js";
import { CommonController } from "./Controllers/CommonController.js";

/* New, game-specific pieces built on the same architecture. */
import { BackgroundHandler } from "./Handlers/BackgroundHandler.js";
import { LevelController } from "./Controllers/LevelController.js";

/**
 * Top-level state machine — same shape as the Earth Defense Game class:
 * a LOADING gate, a MENU, the RUNNING loop, and a WON end screen.
 */
export class Game {
  constructor(canvasContext) {
    if (!(canvasContext instanceof CanvasRenderingContext2D)) {
      throw new TypeError(canvasContext + " is not a canvas context.");
    }

    this.context = canvasContext;
    this.width = this.context.canvas.clientWidth;
    this.height = this.context.canvas.clientHeight;

    // Engine parts, reused verbatim.
    this._input = new InputHandler(this.context, "key", DATA_URL);
    this._common = new CommonController();

    // Game parts.
    this._background = new BackgroundHandler(this.context, this._common);
    this._level = new LevelController(this.context, this._input, this._common);

    this._state = GAME_STATE.LOADING;
  }

  newStart() {
    this._common.reset();
    this._level.reset();
    this._state = GAME_STATE.RUNNING;
  }

  update(deltaTime) {
    switch (this._state) {
      case GAME_STATE.LOADING:
        // Wait for InputHandler to finish fetching key.json.
        if (this._input.isReady()) this._state = GAME_STATE.MENU;
        break;

      case GAME_STATE.MENU:
        if (this._input.isTriggered("JUMP")) this.newStart();
        break;

      case GAME_STATE.RUNNING:
        if (this._input.isTriggered("RESTART")) this._level.reset();
        this._common.setTime(this._common.getTime() + deltaTime);
        if (this._level.update(deltaTime) === "WON") {
          this._state = GAME_STATE.WON;
        }
        break;

      case GAME_STATE.WON:
        if (this._input.isTriggered("JUMP")) this._state = GAME_STATE.MENU;
        break;
    }
  }

  draw() {
    switch (this._state) {
      case GAME_STATE.LOADING:
        this._background.drawLoadingScreen();
        break;

      case GAME_STATE.MENU:
        this._background.drawGameBackground(0);
        this._background.drawMenuScreen();
        break;

      case GAME_STATE.RUNNING:
        this._background.drawGameBackground(this._level.getCameraX());
        this._level.draw();
        this._background.drawHUD(this._common.getDeaths());
        break;

      case GAME_STATE.WON:
        this._background.drawGameBackground(this._level.getCameraX());
        this._level.draw();
        this._background.drawWinScreen(this._common.getDeaths());
        break;
    }
  }
}

const GAME_STATE = {
  LOADING: 0,
  MENU: 1,
  RUNNING: 2,
  WON: 3,
};

const DATA_URL = "./data/";
