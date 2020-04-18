class Display {

  constructor() {
    this.container = '',
      this.layer = {
        name: '',
        canvas: '',
        context2D: '',
        posX: null,
        posY: null,
        width: '',
        height: '',
        backgroundColor: '',
        zIndex: ''
      }
  }


  createLayer(name, width, height, htmlContainer, zIndex, backgroundColor, x, y) {
    let layer = Object.create(this.layer);

    layer.canvas = window.document.createElement('canvas');

    layer.canvas.id = name;

    if (backgroundColor != undefined)
      layer.canvas.style.background = backgroundColor;

    layer.zIndex = zIndex;
    layer.canvas.style.zIndex = zIndex;

    layer.width = width;
    layer.canvas.width = width;

    layer.height = height;
    layer.canvas.height = height;

    if (x != undefined) layer.posX = x;

    if (y != undefined) layer.posY = y;

    layer.canvas.style.position = 'absolute';
    layer.canvas.style.border = '2px solid red';

    if (x != undefined) layer.canvas.style.left = x;

    if (y != undefined) layer.canvas.style.top = y;

    if (htmlContainer != undefined) {
      htmlContainer.appendChild(layer.canvas);
    } else {
      document.body.appendChild(layer.canvas);
    }

    layer.context2D = layer.canvas.getContext('2d');

    return layer;
  }

  drawTextInLayer(targetLayer, text, font, color, x, y) {
    targetLayer.context2D.font = font;
    targetLayer.context2D.fillStyle = color;
    targetLayer.context2D.fillText(text, x, y);
  }

  drawRectangleInLayer(targetLayer, width, heigth, color, x, y) {
    targetLayer.context2D.fillStyle = color;
    targetLayer.context2D.fillRect(x, y, width, heigth);
  }

};
