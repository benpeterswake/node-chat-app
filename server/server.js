const path = require('path');
const http = require('http');
const socketIO = require('socket.io')
const express = require('express');

//local
const {generateMsg} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//start express and http
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMsg('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMsg('Admin', 'New user joined'));

    socket.on('createMessage', (message) => {
      console.log(message);
      io.emit('newMessage', generateMsg(message.from, message.text));
    });

    socket.on('disconnect', () => {
      console.log('User was disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
