var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  var addedUser = false;

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('add user', function(username) {
    if (addedUser) return;

    // username is stored in this current session only
    socket.username = username;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
