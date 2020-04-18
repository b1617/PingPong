class Control {
  constructor(game) {
    (this.mousePointer = null),
      (this.controlSystem = null),
      (this.game = game),
      (this.player = null);
  }

  setPlayer(player) {
    this.player = player;
  }

  onKeyDown = (event) => {
    if (!this.player) this.player = this.game.players[0];
    this.controlSystem = 'KEYBOARD';
    if (event.keyCode == this.game.keycode.KEYDOWN && this.game.gameOn) {
      this.player.goDown = true;
      this.player.goUp = false;
    } else if (event.keyCode == this.game.keycode.KEYUP && this.game.gameOn) {
      this.player.goUp = true;
      this.player.goDown = false;
    } else if (
      event.keyCode === this.game.keycode.SPACE &&
      this.game.gameOn &&
      this.game.isOne &&
      !this.game.started
    ) {
      console.log('spca');
      this.game.started = true;
      this.game.onStartGameWithoutAI(this.player);
    }
  };

  onKeyUp = (event) => {
    if (!this.player) this.player = this.game.players[0];
    if (event.keyCode == this.game.keycode.KEYDOWN) {
      this.player.goDown = false;
    } else if (event.keyCode == this.game.keycode.KEYUP) {
      this.player.goUp = false;
    }
  };

  onMouseMove = (event) => {
    this.controlSystem = 'MOUSE';
    if (!this.player) this.player = this.game.players[0];
    if (event) {
      this.mousePointer = event.clientY;
    }
    if (this.mousePointer > this.player.posY && this.game.gameOn) {
      this.player.goDown = true;
      this.player.goUp = false;
    } else if (this.mousePointer < this.player.posY && this.game.gameOn) {
      this.player.goDown = false;
      this.player.goUp = true;
    } else {
      this.player.goDown = false;
      this.player.goUp = false;
    }
  };
}
