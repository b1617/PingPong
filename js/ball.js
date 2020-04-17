class Ball {
    constructor() {
        this.width = 10,
            this.height = 10,
            this.color = '#FF2222',
            this.posX = 200,
            this.posY = 200,
            this.speed = 1,
            this.inGame = true,
            this.directionX = 1,
            this.directionY = 1,
            this.game = null,
            this.wallSound = new Audio('../sound/wall.ogg')
    }

    lostBall() {
        for (const player of this.game.players) {
            if (this.lost(player)) {
                console.log('lost ball', player);
                player.originalPosition === 'left' ? this.game.rightScore++ : this.game.leftScore++;
                if (!this.game.default && (this.game.leftScore === 1 || this.game.rightScore === 1)) {
                    this.game.gameOn = false;
                    this.inGame = false;
                    // we have to print winner 
                    if (this.game.single) {
                        let id = player.originalPosition === 'right' ? 'win' : 'lost';
                        console.log('calling on lost ball');
                        document.getElementById(id).style.display = 'block';
                    }
                } else {
                    this.inGame = false;
                    if (this.game.single) {
                        if (player.ai) {
                            setTimeout(this.game.startBall(player), 3000);
                        }
                        else {
                            setTimeout(this.game.onStartGame(player), 3000);
                        }
                    } else {
                        console.log('todo mutli')
                    }
                }
            }
        }
        this.game.clearLayer('SCORE');
        this.game.displayScore(this.game.leftScore, this.game.rightScore);
    }

    move() {
        if (this.inGame) {
            this.posX += this.directionX * this.speed;
            this.posY += this.directionY * this.speed;
            this.speedUp();
        }
    }

    bounce(width, height) {
        if (this.posX > width || this.posX < 0) {
            this.directionX = -this.directionX;
            if (!this.game.default) this.wallSound.play();
        }
        if (this.posY > height || this.posY < 0) {
            this.directionY = -this.directionY;
            if (!this.game.default) this.wallSound.play();
        }
    }

    collide(anotherItem) {
        if (
            !(
                this.posX >= anotherItem.posX + anotherItem.width ||
                this.posX <= anotherItem.posX - this.width ||
                this.posY >= anotherItem.posY + anotherItem.height ||
                this.posY <= anotherItem.posY - this.height
            )
        ) {
            // Collision
            return true;
        }
        return false;
    }


    collideBallWithPlayersAndAction(players) {
        for (const player of players) {
            if (this.collide(player)) {
                this.changeBallPath(player);
            }
        }
    }

    setGame(game) {
        this.game = game;
    }

    ballOnPlayer(player) {
        let returnValue = 'CENTER';
        let playerPositions = player.height / 5;
        if (this.posY > player.posY && this.posY < player.posY + playerPositions) {
            returnValue = 'TOP';
        } else if (
            this.posY >= player.posY + playerPositions &&
            this.posY < player.posY + playerPositions * 2
        ) {
            returnValue = 'MIDDLETOP';
        } else if (
            this.posY >= player.posY + playerPositions * 2 &&
            this.posY < player.posY + player.height - playerPositions
        ) {
            returnValue = 'MIDDLEBOTTOM';
        } else if (
            this.posY >= player.posY + player.height - playerPositions &&
            this.posY < player.posY + player.height
        ) {
            returnValue = 'BOTTOM';
        }
        return returnValue;
    }

    changeBallPath(player) {
        if (player.originalPosition == 'left') {
            switch (this.ballOnPlayer(player)) {
                case 'TOP':
                    this.directionX = 1;
                    this.directionY = -3;
                    break;
                case 'MIDDLETOP':
                    this.directionX = 1;
                    this.directionY = -1;
                    break;
                case 'CENTER':
                    this.directionX = 2;
                    this.directionY = 0;
                    break;
                case 'MIDDLEBOTTOM':
                    this.directionX = 1;
                    this.directionY = 1;
                    break;
                case 'BOTTOM':
                    this.directionX = 1;
                    this.directionY = 3;
                    break;
            }
        } else {
            switch (this.ballOnPlayer(player)) {
                case 'TOP':
                    this.directionX = -1;
                    this.directionY = -3;
                    break;
                case 'MIDDLETOP':
                    this.directionX = -1;
                    this.directionY = -1;
                    break;
                case 'CENTER':
                    this.directionX = -2;
                    this.directionY = 0;
                    break;
                case 'MIDDLEBOTTOM':
                    this.directionX = -1;
                    this.directionY = 1;
                    break;
                case 'BOTTOM':
                    this.directionX = -1;
                    this.directionY = 3;
                    break;
            }
        }
    }


    lost(player) {
        let returnValue = false;
        if (
            player.originalPosition == 'left' &&
            this.posX < player.posX - this.width
        ) {
            returnValue = true;
        } else if (
            player.originalPosition == 'right' &&
            this.posX > player.posX + player.width
        ) {
            returnValue = true;
        }
        return returnValue;
    }
    speedUp() {
        let add = this.game.default ? 0.00001 : 0.0001
        this.speed = this.speed + add;
    }
}