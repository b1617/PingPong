class Player {
  constructor(posX, posY, originalPosition) {
    this.width = 10,
      this.height = 50,
      this.color = '#FFFFFF',
      this.posX = posX, // 30
      this.posY = posY, // 200
      this.goUp = false,
      this.goDown = false,
      this.originalPosition = originalPosition,
      this.ai = false
  }


  move(control, groundHeight) {
    if (control.controlSystem == 'KEYBOARD') {
      // keyboard control
      if (this.goUp && this.posY > 0) {
        this.posY -= 5;
      } else if (
        this.goDown &&
        this.posY < groundHeight - this.height
      ) {
        this.posY += 5;
      }
    } else if (control.controlSystem == 'MOUSE') {
      // mouse control
      if (
        this.goUp &&
        this.posY > control.mousePointer &&
        this.posY > 0
      )
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
