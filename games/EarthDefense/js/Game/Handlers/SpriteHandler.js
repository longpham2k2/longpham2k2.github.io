import { SpritePreloader } from "../Preloaders/SpritePreloader.js";

export class SpriteHandler {
  constructor() {
    this._preloaders = [];
    this._nameLoaded = false;
    this._spriteLoading = false;
    this._spriteLoaded = false;
  }

  /**
   * Assign a Sprite Preloader to the Sprite Handler. 
   * The preloader will be a property of the handler.
   * @param {String} keyName
   * @param {SpritePreloader} spritePreloader 
   */
  handle(keyName, spritePreloader) {
    this._preloaders.push(spritePreloader);
    this[keyName] = spritePreloader;
  }

  getReady() {
    if (!this._nameLoaded) {
      this._nameLoaded = true;
      this._preloaders.forEach((preloader) => this._nameLoaded = (this._nameLoaded && preloader.isReady()));

      return;
    } 

    if (!this._spriteLoading) {
      this._spriteLoading = true;
      this._preloaders.forEach((preloader) => preloader.loadImages());

      return;
    } 

    if (!this._spriteLoaded) {
      this._spriteLoaded = true;
      this._preloaders.forEach((preloader) => this._spriteLoaded = (this._spriteLoaded && preloader.isLoaded()));

      return;
    }
  }

  getSprites() {
    this._preloaders.forEach((preloader) => preloader.setSprites());    
  }

  isReady() {
    return this._spriteLoaded;
  }

}