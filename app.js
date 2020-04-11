require('dotenv').config();
const express = require('express');
const app = express();
// const server = require('http').Server(app);
const path = require('path');
const PORT = process.env.PORT || 3000;
// const io = require('socket.io').listen(server);
app.use(express.static('.'));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('running on ' + PORT);
});

// io.on('connection', function (socket) {
//     console.log('a user connected');
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });