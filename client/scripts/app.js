// YOUR CODE HERE:
var chatRoomNames = {};
var currentRoom = 'lobby';

var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  init: function() {
    $('#send').on('submit', function(event) {
      event.preventDefault(); // prevents page reload
      app.handleSubmit();
    });
    $('.clearChat').on('click', function(event) {
      event.preventDefault();
      app.clearMessages();
    });
    $('.refreshChat').on('click', function(event) {
      event.preventDefault();
      app.clearMessages();
      app.fetch();
    });
    $('#roomSelect').on('change', function(event) {
      currentRoom = $(this).val();
      app.clearMessages();
      app.fetch();
    });
    $('.makeNewRoom').on('click', function(event) {
      event.preventDefault();
      currentRoom = prompt("What's the name of your new room?");
      chatRoomNames[currentRoom] = true;
      app.addRoom(currentRoom);
      $('#roomSelect').val(currentRoom);
    });
    app.fetch();
    setInterval(function() {
      app.clearMessages();
      app.fetch();
    }, 5000);
  },
  send: function(message) {
    $.ajax({
      url: this.server,
      type: "POST",
      data: JSON.stringify(message),
      contentType: "application/json",
      success: function(data) {
        console.log("chatterbox: Message Sent! data: ", data);
      },
      error: function(data) {
        console.log("chatterbox: Failed to send message. Error: ", data);
      }
    });
  },
  fetch: function(chatroom) {
    chatroom = chatroom || "lobby";
    $.ajax({
      url: this.server,
      type: "GET",
      data: {order: "-createdAt"}, //, where: { roomname: "lobby" }
      dataType: "json",
      success: function(data) {
        console.log("chatterbox: Fetched! data: ", data);
        $('#roomSelect').children().remove();
        for(var i = 0; i < data.results.length; i++) {
          app.addMessage(data.results[i]);
          if(!(data.results[i].roomname in chatRoomNames)) {
            chatRoomNames[data.results[i].roomname] = true;
          }
        }
        for(var room in chatRoomNames) {
          app.addRoom(room);
        }
        $('#roomSelect').val(currentRoom);
      }
      // error: function() {}
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    message.roomname = (message.roomname || "All Rooms").trim();
    if(message.roomname === currentRoom) {
      message.text = (message.text || message.message || "").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      var userName = $('<span class="username">' + message.username + '</span>');
      var text = $('<span class="message">' + message.text + '</span>');
      var roomName = $('<span class="roomName">' + message.roomname + '</span>');
      var div = $('<div></div>');

      div.addClass(message.roomname);
      userName.addClass(message.username);

      userName.on('click', function() {
        app.addFriend($(this).attr('class').split(" ")[1]);
      });

      div.append(userName, text, roomName);
      $('#chats').append(div);
    }
  },
  addRoom: function(room) {
    var newOption = $('<option>' + room + '</option>');
    $('#roomSelect').append(newOption);
  },
  addFriend: function(username) {
    $('.' + username).addClass('friends');
  },
  handleSubmit: function() {
    var messageObj = {
      text: $('#message').val(),
      username: window.location.search.split('username=')[1],
      roomname: $('#roomSelect').val()
    };
    currentRoom = $('#roomSelect').val();
    app.send(messageObj);
    app.clearMessages();
    $('#roomSelect').children().remove();
    app.fetch();
  }
};


app.init();