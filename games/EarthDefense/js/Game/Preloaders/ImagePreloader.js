export class ImagePreloader {
  constructor(assetNames, assetUrl) {
    this._loadComplete = false;
    this._processedImages = [];

    this.preload(assetNames, assetUrl);
  }

  preload(names, url) {
    let images = [];
    names.forEach((name) => images.push(fetchImage(url + name + '.png')));

    Promise.all(images)
      .then((loadedImages) => {
        let bitmaps = [];
        loadedImages.forEach((loadedImage) => bitmaps.push(createImageBitmap(loadedImage)));

        return Promise.all(bitmaps);
      })
      .then((createdBitmaps) => {
        this._processedImages = [...createdBitmaps];
        this._loadComplete = true;
      })
      .catch((err) => console.error(err));
  }

  isCompleted() {
    return this._loadComplete;
  }

  getBitmaps() {
    return this._processedImages;
  }
}

/**
 * @param {String} url The URL of the image
 * @returns {Promise<Image>} A promise of an image
 */
function fetchImage(url) {
  return new Promise((resolve, reject) => {
   const img = new Image();
   img.addEventListener('load', () => resolve(img));
   img.addEventListener('error', (err) => reject(err));
   img.src = url;
  });
}