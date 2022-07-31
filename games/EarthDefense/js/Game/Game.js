import { SpritePreloader } from "./Preloaders/SpritePreloader.js";
import { SpriteHandler } from "./Handlers/SpriteHandler.js";
import { InputHandler } from "./Handlers/InputHandler.js";
import { BackgroundHandler } from "./Handlers/BackgroundHandler.js";
import { CommonController } from "./Controllers/CommonController.js";
import { ObjectController } from "./Controllers/ObjectController.js";
import { Button } from "./Objects/Button.js";

export class Game {
  constructor(canvasContext) {
    if (!(canvasContext instanceof CanvasRenderingContext2D)) {
      throw new TypeError(canvasContext + ' is not a canvas context.');
    } 
    
    this.context = canvasContext;
    this.width = this.context.canvas.clientWidth;
    this.height = this.context.canvas.clientHeight;
    
    this._inputHandler = new InputHandler(this.context, 'key', DATA_URL);
    this._spriteHandler = new SpriteHandler();
    this._spriteHandler.handle('system', new SpritePreloader('system', DATA_URL, ASSET_URL + 'img/system/'));
    this._spriteHandler.handle('character', new SpritePreloader('character', DATA_URL, ASSET_URL + 'img/character/'));

    this._commonController = new CommonController();
    this._objectController = new ObjectController(this.context, this._spriteHandler, this._inputHandler, this._commonController);

    this._state = GAME_STATE.LOADING; 
    this._backgroundHandler = new BackgroundHandler(this.context, this._commonController);   
  }

  newStart() {
    this._buttons = {};
    this._buttons.pauseButton = new Button(this.context, this._spriteHandler.system.sprites[1], this.width/2, 25, 0, 50, 50);

    this._commonController.reset();
    this._objectController.init();
  }
  
  update(deltaTime){
    switch (this._state) {
      case GAME_STATE.LOADING:
        this._spriteHandler.getReady();
        if (this._spriteHandler.isReady()) {
          this._state = GAME_STATE.MENU;
          this._spriteHandler.getSprites();
        } 
      break;

      case GAME_STATE.MENU:
        if (this._inputHandler.isTriggered("ACCEPT")) {
          this.newStart();

          this._state = GAME_STATE.RUNNING;
        }
      break;
      
      case GAME_STATE.RUNNING:
        Object.keys(this._buttons).forEach((key) => {
            this._buttons[key].update();
        });
        this._commonController.setTime(this._commonController.getTime() + deltaTime);
        this._objectController.update(deltaTime);

        if (this._objectController.checkGameOver()) {
          this._state = GAME_STATE.OVER; 
          let index = 0;
          Object.keys(this._buttons).forEach((key) => {
            this._buttons[key].changeSprite(this._spriteHandler.system.sprites[index])
            index = index + 2;
          });
        }

        if (this._inputHandler.isTriggered("ACCEPT")) {
            this._state = GAME_STATE.PAUSED;
        }
      break;

      case GAME_STATE.PAUSED:
        if (this._inputHandler.isTriggered("ACCEPT")) {
          this._state = GAME_STATE.RUNNING;
        }
      break;

      case GAME_STATE.OVER:
        if (this._inputHandler.isTriggered("ACCEPT")) {
          this._state = GAME_STATE.MENU;
        }
      break;
    }
  }
  draw(){
    switch (this._state) {
      case GAME_STATE.LOADING:
        this._backgroundHandler.drawLoadingScreen();
      break;

      case GAME_STATE.MENU:
        this._backgroundHandler.drawMenuScreen();
      break;

      case GAME_STATE.RUNNING:
        this._backgroundHandler.drawGameBackground();

        this._objectController.draw();
        Object.keys(this._buttons).forEach((key) => {
            this._buttons[key].draw();
        });
        
        this._backgroundHandler.drawGameUserInterface();  
      break;

      case GAME_STATE.PAUSED:
        this._backgroundHandler.drawPausedScreen();
      break;
      
      case GAME_STATE.OVER:
        this._backgroundHandler.drawOverBackground();

        this._objectController.draw();
        Object.keys(this._buttons).forEach((key) => {
          this._buttons[key].draw();
        });
          
        this._backgroundHandler.drawOverUserInterface();
      break;
    }
  }
}

const GAME_STATE = {
  LOADING: 0,
  MENU: 1,
  RUNNING: 2,
  PAUSED: 3,
  OVER: 4
};

const DATA_URL = './data/';

const ASSET_URL = './asset/';