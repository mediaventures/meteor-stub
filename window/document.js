function hexToRgba(hex, opacity) {
  var opacity = isNaN(opacity) ? 100 : opacity;
  var hex = hex.replace('#', '');
  if (hex.length === 6) {
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
  } else {
    var rd = hex.substring(0, 1) + hex.substring(0, 1);
    var gd = hex.substring(1, 2) + hex.substring(1, 2);
    var bd = hex.substring(2, 3) + hex.substring(2, 3);
    var r = parseInt(rd, 16);
    var g = parseInt(gd, 16);
    var b = parseInt(bd, 16);
  }

  return [r, g, b,opacity / 100];
};


class Rect {
  constructor(x0, y0, x1, y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  fill(style) {
    const width = Math.abs(this.x1 - this.x0);
    const height = Math.abs(this.y1 - this.y0);

    // Create data
    const dataArray = [].concat.apply([], Array(width * height).fill().map(_ => hexToRgba(style)));
    const data = Uint8ClampedArray.from(dataArray);
    return { data, width, height }
  }
}

class Context2D {
  constructor() {
    this.fillStyle = '';
    this.currentShape;
    this.imageData = null;
  }

  beginPath() {}

  rect(x0, y0, x1, y1) {
    this.currentShape = new Rect(x0, y0, x1, y1);
  }

  fill() {
    this.imageData = this.currentShape.fill(this.fillStyle);
  }

  getImageData(x0, y0, x1, y1) {
    return this.imageData;
  }
}

class Canvas {
  getContext() {
    return new Context2D();
  }
}

module.exports = {
  createElement(elem) {
    switch (elem.toUpperCase()) {
    case 'CANVAS':
      return new Canvas();
      break;
    default:
      return null;
    }
  }
};
