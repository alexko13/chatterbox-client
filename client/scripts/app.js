// YOUR CODE HERE:

var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  init: function() {
    $('#send').on('submit', function(event) {
      event.preventDefault(); // prevents page reload
      app.handleSubmit();
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
  fetch: function() {
    $.ajax({
      url: this.server,
      type: "GET",
      data: "",
      dataType: "json",
      success: function(data) {
        console.log("chatterbox: Fetched! data: ", data);
        for(var i = 0; i < 5; i++) {
          app.addMessage(data.results[i]);
        }
      }
      // error: function() {}
    });
  },
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    console.log(message);
    message.text = message.text || message.message;
    var userName = $('<span class="username">' + message.username + '</span>');
    var text = $('<span class="message">' + message.text + '</span>');
    if(message.roomname) {
      var roomName = $('<span class="roomName">' + message.roomname + '</span>');
    }
    var div = $('<div></div>');
    userName.on('click', function() {
      app.addFriend();
    });
    div.append(userName, text, roomName);
    $('#chats').append(div);
  },
  addRoom: function(room) {
    $('#roomSelect').append('<p>' + room + '</p>');
  },
  addFriend: function() {},
  handleSubmit: function() {
    //console.log(message);
    //var text = $('#message').val();
    //app.send(text);
  }
};


app.init();