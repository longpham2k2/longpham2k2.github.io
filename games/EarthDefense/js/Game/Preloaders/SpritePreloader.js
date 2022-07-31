import { ImagePreloader } from "../Preloaders/ImagePreloader.js";
import { JSONPreloader } from "../Preloaders/JSONPreloader.js";

export class SpritePreloader {
  constructor(nameListName, nameListUrl, assetUrl) {
    this.nameLoader = null;
    this.imageLoader = null;
    this.sprites = [];

    this.loadNames(nameListName, nameListUrl);
    this.assetUrl = assetUrl;
  }

  loadNames(name, url) {
    this.nameLoader = new JSONPreloader(name, url);
  }

  loadImages() {
    if (!this.isReady()) {
      return;
    }

    this.names = [...this.nameLoader.getData().name];
    this.imageLoader = new ImagePreloader(this.names, this.assetUrl);
  }

  setSprites() {
    if (!this.isLoaded()) {
      return null;
    }
    this.sprites = [...this.imageLoader.getBitmaps()];
  }

  isReady() {
    return this.nameLoader.isCompleted();
  }

  isLoaded() {
    if (!this.imageLoader) {
      return false;
    }

    return this.imageLoader.isCompleted();
  }
  
}