export class JSONPreloader {
  constructor(fileName, fileUrl) {
    this._loadComplete = false;
    this._jsonData = {};
    
    this.preload(fileName, fileUrl);
  }

  preload(name, url) {
    fetch(url + name + '.json')
      .then((response) => response.json())
      .then((jsonFile) => {
        this._loadComplete = true;
        this._jsonData = Object.assign({}, jsonFile);
      })
      .catch((reason) => console.error(reason));
  }

  isCompleted() {
    return this._loadComplete;
  }

  getData() {
    return this._jsonData;
  }
}