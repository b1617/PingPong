require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);

const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);
app.use(express.static('.'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let games = {};

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('creation', function (data) {
        console.log(data);

        const key = Math.random().toString(36).substring(7);
        games[key] = { id: socket.id, username: data.username };
        socket.emit('created', {
            'username': data.username, secretId: key
        });
    });

    socket.on('joining', function (data) {
        console.log(games);
        console.log('data joining ', data)
        socket.to(games[data.secretId].id).emit('joined', { username: data.username });
        socket.emit('createOnJoin', { username: games[data.secretId].username, secretId: data.secretId });
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('moveBall', function (data) {
        const { x, y, speed } = data;
        socket.broadcast.emit('moveBall', { x, y, speed });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});