$(function() {

  var $inputMessage = $('textarea'); // Input message input box

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  var socket = io();
  $('form').submit(function() {
    console.log('Value: ' + $('textarea').val());
    socket.emit('chat message', $.trim($('textarea').val()));
    $('textarea').val('');
    return false;
  });

  $("textarea").keypress(function(e) {
    if (e.which == 13 && !e.shiftKey) {
      if ($.trim($("textarea").val()) != "") {
        $(this).closest("form").submit();
        e.preventDefault();
        return false;
      }
    }
    if($(this).get(0).selectionStart == 0 && (e.keyCode == 13)) {
      e.preventDefault();
      return false;
    }
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

  socket.on('chat message', function(username, msg) {
    $('.messages').append($('<div class="message-group">').append($('<div class="comment">').text(username + ': ' + msg)));
  });

});
