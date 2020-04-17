class Control {

  constructor(game) {
    this.mousePointer = null,
      this.controlSystem = null,
      this.game = game
  }

  onKeyDown = (event) => {
    let player = this.game.players[0];
    this.controlSystem = 'KEYBOARD';
    if (event.keyCode == this.game.keycode.KEYDOWN && this.game.gameOn) {
      player.goDown = true;
      player.goUp = false;
    } else if (event.keyCode == this.game.keycode.KEYUP && this.game.gameOn) {
      player.goUp = true;
      player.goDown = false;
    }
  }

  onKeyUp = (event) => {
    let player = this.game.players[0];
    if (event.keyCode == this.game.keycode.KEYDOWN) {
      player.goDown = false;
    } else if (event.keyCode == this.game.keycode.KEYUP) {
      player.goUp = false;
    }
  }

  onMouseMove = (event) => {
    this.controlSystem = 'MOUSE';
    let player = this.game.players[0];
    if (event) {
      this.mousePointer = event.clientY;
    }
    if (this.mousePointer > player.posY && this.game.gameOn) {
      player.goDown = true;
      player.goUp = false;
    } else if (this.mousePointer < player.posY && this.game.gameOn) {
      player.goDown = false;
      player.goUp = true;
    } else {
      player.goDown = false;
      player.goUp = false;
    }
  }
}
