// YOUR CODE HERE:

var app = {
  init: function() {},
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
      }
      // error: function() {}
    });
  },
  server: "https://api.parse.com/1/classes/chatterbox",
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    var userName = '<span class="userName">' + message.username + '</span>';
    var text = '<span class="message">' + message.text + '</span>';
    var roomName = '<span class="roomName">' + message.roomname + '</span>';
    $('#chats').append('<p>' + userName + text + roomName + '</p>');
  },
  addRoom: function(room) {
    $('#roomSelect').append('<p>' + room + '</p>');
  }
};