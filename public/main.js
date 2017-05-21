$(function () {

 var $inputMessage = $('.inputMessage'); // Input message input box

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }


  var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('.inputMessage').val());
    $('.inputMessage').val('');
    return false;
  });

  function sendMessage() {
    var message = $inputMessage.val();

    message = cleanInput(message);

    // if there is a non-empty message and a socket connection
   if (message && connected) {
     $inputMessage.val('');
     addChatMessage({
       username: username,
       message: message
     });
     // tell server to execute 'new message' and send along one parameter
     socket.emit('new message', message);
   }
  }


  socket.on('chat message', function(msg){
    $('.messages').append($('<div class="message-group">').append($('<div class="comment">').text(msg)));
  });














});
