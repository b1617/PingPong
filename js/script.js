(function () {
    // début du code isolé
    let requestAnimId;

    let initialisation = function () {
        // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
    }
    let main = function () {
        // le code du jeu
        game.clearLayer(game.playersBallLayer);
        game.movePlayers();
        game.displayPlayers();
        game.moveBall();
        if (game.ball.inGame) {
            game.lostBall();
        }
        game.ai.move();
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
    }
    window.onload = initialisation; // appel de la fonction initialisation au chargement de la page
    // fin du code isol
    $('#startGame').click(() => {
        $('#restartGame').css('display', 'inline');
    });
})();