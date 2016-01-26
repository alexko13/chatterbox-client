// YOUR CODE HERE:
var chatRoomNames = {};
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
    this.fetch();
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
        for(var i = 0; i < 5; i++) {
          app.addMessage(data.results[i]);
          if(!(data.results[i].roomname in chatRoomNames)) {
            console.log(data.results[i].roomname);
            app.addRoom(data.results[i].roomname);
            chatRoomNames[data.results[i].roomname] = data.results[i].roomname;
          }
        }
      }
      // error: function() {}
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    message.text = (message.text || message.message || "").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    message.roomname = (message.roomname || "All Rooms").trim();
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

    app.send(messageObj);
    app.clearMessages();
    $('#roomSelect').children().remove();
    chatRoomNames = {};
    app.fetch();
  }
};


app.init();