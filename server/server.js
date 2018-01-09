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
      from: 'admin',
      text: 'Welcome to Code Chat!',
      createdAt: new Date().setTime()
    });

    socket.broadcast.emit('newMessage', {
      from: 'admin',
      text: 'New user has entered the chat!',
      createdAt: new Date().setTime()
    });

    socket.on('createMessage', (message) => {
      console.log(message);
      io.emit('newMessage', {
        from: message.from,
        text: message.text,
        createdAt: new Date().getTime()
      });
      // socket.broadcast.emit('newMessage', {
      //   from: message.from,
      //   text: message.text,
      //   createdAt: new Date().setTime()
      // });
    });

    socket.on('disconnect', () => {
      console.log('User was disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
