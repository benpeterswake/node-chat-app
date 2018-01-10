const path = require('path');
const http = require('http');
const socketIO = require('socket.io')
const express = require('express');

//local
const {Users} = require('./utils/users');
const {generateMsg, generateLocationMsg} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

//start express and http
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
      if(!isRealString(params.name) || !isRealString(params.room)){
        return callback('Name and room name are required.')
      }

      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));

      socket.emit('newMessage', generateMsg('BenBot', 'Hey guys this is Ben! Right now you are interactiving with my node.js chat app! Send me a message!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMsg('BenBot', `${params.name} has joined the chat.`));
      callback();
    });

    socket.on('createMessage', (message, callback) => {
      console.log(message);
      io.emit('newMessage', generateMsg(message.from, message.text));
      callback('Delivered');
    });

    socket.on('createLocationMessage', (coords) => {
      io.emit('newLocationMessage', generateLocationMsg('User', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
      var user = users.removeUser(socket.id);

      if(user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMsg('BenBot', `${user.name} has left the chat.`));
      }
    });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
