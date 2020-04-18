# Ping Pong

Simple game build with canvas and socketIO.

# How to play ?

Play with your online friend or with our AI.

- You need **3 points** to win the game.
- You can play either with the **mouse** or **keypad**.

Steps to create an online game :

1. Player 1 : Create a game with **2** or **4** players and send the **secret key** to your friends.
2. Player 2 : Enter the **secret key** to join the game.
3. Player 1 : Press the start button to **play**.

## Installation

- Use the package manager [npm](https://nodejs.org/en/) to install and run the project.

```bash
npm install
npm start
```

- Use [Docker](https://www.docker.com/)

```bash
docker run -d -p 4000:4000 nesdi/pingpong
```

Open [http://localhost:4000](http://localhost:4000) to play the game.

## Technologies

- HTML5 (Canvas)
- CSS3
- NodeJS (ExpressJS)
- Socket.IO
- Docker
