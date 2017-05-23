var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const username = require('username');

var users = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Connection Event
io.on('connection', function(client) {
  var userName = username().then(username => {
    console.log(username + ' connected');
  });

  var addedUser = false;
  // Chat Message Event
  client.on('chat message', function(msg) {
    console.log(username.sync())
    io.emit('chat message', username.sync(), msg);
  });
  // Disconnect Event
  client.on('disconnect', function() {
    console.log('user disconnected');
  });
  // Add User Event
  client.on('add user', function(username) {
    if (addedUser) return;
    // username is stored in this current session only
    client.username = username;
    addedUser = true;
    client.emit('login', {
      numUsers: numUsers
    });
    client.broadcast.emit('user joined', {
      username: client.username,
      numUsers: numUsers
    });
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
