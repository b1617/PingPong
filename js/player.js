class Player {
  constructor(posX, posY, originalPosition, color) {
    (this.width = 10),
      (this.height = 50),
      (this.color = color),
      (this.posX = posX), // 30
      (this.posY = posY), // 200
      (this.goUp = false),
      (this.goDown = false),
      (this.originalPosition = originalPosition),
      (this.ai = false);
  }

  setY(y) {
    this.posY = y;
  }

  getY() {
    return this.posY;
  }

  getX() {
    return this.posX;
  }

  initPos() {
    if (this.originalPosition === 'left') {
      this.posY = 175;
    } else {
      this.posY = 175;
    }
  }

  move(control, groundHeight) {
    if (control.controlSystem == 'KEYBOARD') {
      if (this.goUp && this.posY > 0) {
        this.posY -= 5;
      } else if (this.goDown && this.posY < groundHeight - this.height) {
        this.posY += 5;
      }
    } else if (control.controlSystem == 'MOUSE') {
      if (this.goUp && this.posY > control.mousePointer && this.posY > 0)
        this.posY -= 5;
      else if (
        this.goDown &&
        this.posY < control.mousePointer &&
        this.posY < groundHeight - this.height
      )
        this.posY += 5;
    }
  }
}
