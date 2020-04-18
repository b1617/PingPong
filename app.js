require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let games = {};
io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('creation', function (data) {
    console.log('creation', data);
    const key = Math.random().toString(36).substring(7);
    games[key] = { players: [data.username], nbPlayers: data.nbPlayers };
    const players = games[key].players;
    socket.join(key);
    socket.emit('created', {
      username: data.username,
      players,
      secretId: key
    });
  });

  socket.on('joining', function (data) {
    console.log('joining', data);
    console.log('find', games[data.secretId]);
    const key = data.secretId;
    if (games[key] && games[key].players.length < games[key].nbPlayers) {
      games[key].players.push(data.username);
      socket.join(key);
      socket.in(key).emit('joined', {
        username: data.username,
        num: games[key].players.length,
        nbPlayers: games[key].nbPlayers
      });

      socket.emit('createOnJoin', {
        secretId: key,
        players: games[key].players,
        nbPlayers: games[key].nbPlayers
      });
    } else {
      socket.emit('erreur', { message: 'The game is full' });
    }
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('information', function (data) {
    const { x, y, s1, s2, key } = data;
    socket.in(key).emit('information', { x, y, s1, s2 });
  });

  socket.on('movePlayer', function (data) {
    const { y, n, key } = data;
    socket.in(key).emit('movePlayer', { y, n });
  });

  socket.on('restart', function (data) {
    const { key } = data;
    console.log(key);
    socket.in(key).emit('restart');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
