var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('index'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index/index.html');
});

// let user = Array();
let userCount = 0;
let usernames = [];

io.on('connection', function(socket) {

  socket.on('enter', function(name) {
    usernames[socket.id] = name;
    console.log(`${name} connected`);
    userCount++;
    console.log(`${userCount} users`);
    io.emit('change', userCount);
  })
  socket.on('chat message', function(msg) {
    io.emit('chat message', usernames[socket.id] + ": " + msg);
    console.log(usernames[socket.id] + " say " + msg);
  });

  socket.on('disconnect', function() {
    if (usernames[socket.id] != null){
      console.log(`${usernames[socket.id]} disconnected`);
    }
    userCount--;
    console.log(`${userCount} users`);
    io.emit('change', userCount);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});