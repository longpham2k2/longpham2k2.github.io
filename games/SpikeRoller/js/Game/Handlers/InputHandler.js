/* Copied from the Earth Defense engine so Spike Roller can evolve its own
 * copy without touching the legacy game. Config-driven via data/key.json. */
export class InputHandler {
  constructor(gameContext, keyConfigurationName, keyConfigurationUrl) {
    this.setContext(gameContext);

    this.ready = false;
    this.loadConfig(keyConfigurationName, keyConfigurationUrl);

    this.keyMap = {};
    this.keyState = {};
    this.mousePosition = { x: 0, y: 0 };
    this.mouseState = false;
  }

  loadConfig(name, url) {
    fetch(url + name + ".json")
      .then((response) => response.json())
      .then((keyConfig) => {
        for (const keyName in keyConfig) {
          keyConfig[keyName].forEach((keyValue) => (this.keyMap[keyValue] = keyName));
        }
        this.ready = true;
      })
      .catch((reason) => console.error(reason));
  }

  isReady() {
    return this.ready;
  }

  setContext(gameContext) {
    this.context = gameContext;

    let canvas = this.context.canvas;
    canvas.addEventListener("keydown", this.onKeyDown.bind(this));
    canvas.addEventListener("keyup", this.onKeyUp.bind(this));
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  shouldPreventDefault(keyValue) {
    switch (keyValue) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowRight":
      case "ArrowLeft":
      case "Home":
      case "End":
      case "PageUp":
      case "PageDown":
      case "Tab":
      case "Enter":
      case "Spacebar": // Older browsers
      case " ":
        return true;
    }
    return false;
  }

  onKeyDown(event) {
    if (this.shouldPreventDefault(event.key)) {
      event.preventDefault();
    }
    let keyName = this.keyMap[event.key];
    if (keyName) {
      this.keyState[keyName] = true;
    }
  }

  onKeyUp(event) {
    let keyName = this.keyMap[event.key];
    if (keyName) {
      this.keyState[keyName] = false;
    }
  }

  onMouseMove(event) {
    let clientRect = this.context.canvas.getBoundingClientRect();
    this.mousePosition.x = event.clientX - clientRect.left;
    this.mousePosition.y = event.clientY - clientRect.top;
  }

  onMouseDown(event) {
    this.mouseState = true;
  }

  onMouseUp(event) {
    this.mouseState = false;
  }

  /** True once per press — good for jumps, menu confirms, restart. */
  isTriggered(keyName) {
    if (!!this.keyState[keyName]) {
      this.keyState[keyName] = false;
      return true;
    } else {
      return false;
    }
  }

  /** True while held — good for left/right movement. */
  isPressed(keyName) {
    return !!this.keyState[keyName];
  }

  getMousePosition() {
    return this.mousePosition;
  }

  isMouseDown() {
    return this.mouseState;
  }
}
