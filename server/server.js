const path = require('path');
const http = require('http');
const socketIO = require('socket.io')
const express = require('express');

//local
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//start express and http
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
      from: 'ben1337@test.com',
      text: 'whats up now?',
      createAt: 123
    });

    socket.on('createMessage', (newMessage) => {
      console.log(newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User was disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
