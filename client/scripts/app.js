// YOUR CODE HERE:
$(function() {
  app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'Anonymous',
    currentRoom: 'lobby',
    init: function() {
      app.username = window.location.search.split('username=')[1];
      app.chatRooms = {};
      app.friends = {};
      app.$send = $('#send');
      app.$chats = $('#chats');
      app.$message = $('#message');
      app.$roomSelect = $('#roomSelect');
      app.$clearChat = $('.clearChat');
      app.$refreshChat = $('.refreshChat');
      app.$makeNewRoom = $('.makeNewRoom');

      app.$send.on('submit', function(event) {
        event.preventDefault();
        app.handleSubmit();
      });

      app.$clearChat.on('click', function(event) {
        app.clearMessages();
      });

      app.$refreshChat.on('click', function(event) {
        app.fetch();
      });

      app.$roomSelect.on('change', function(event) {
        app.currentRoom = app.$roomSelect.val();
        app.fetch();
      });

      app.$makeNewRoom.on('click', function(event) {
        app.currentRoom = prompt("What's the name of your new room?");
        app.chatRooms[app.currentRoom] = true;
        app.addRoom(app.currentRoom);
        app.$roomSelect.val(app.currentRoom);
      });

      app.fetch();
      setInterval(function() {
        app.fetch();
      }, 5000);
    },
    send: function(message) {
      $.ajax({
        url: app.server,
        type: "POST",
        data: JSON.stringify(message),
        contentType: "application/json",
        success: function(data) {
          console.log("chatterbox: Message Sent! data: ", data);
          app.fetch();
        },
        error: function(data) {
          console.log("chatterbox: Failed to send message. Error: ", data);
        }
      });
    },
    fetch: function(chatroom) {
      chatroom = chatroom || "lobby";
      $.ajax({
        url: app.server,
        type: "GET",
        data: {order: "-createdAt"},
        dataType: "json",
        success: function(data) {
          console.log("chatterbox: Fetched! data: ", data);
          app.populateRoomsAndChats(data);
        },
        error: function(data) {
          console.log("chatterbox: Failed to fetch data. Error: ", data);
        }
      });
    },
    populateRoomsAndChats: function(data) {
      app.clearMessages();
      for(var i = 0; i < data.results.length; i++) {
        var result = data.results[i];
        app.addMessage(result);
        if(!app.chatRooms[result.roomname]) {
          app.chatRooms[result.roomname] = true;
        }
      }

      app.$roomSelect.html('');
      for(var room in app.chatRooms) {
        app.addRoom(room);
      }
      app.$roomSelect.val(app.currentRoom);
    },

    clearMessages: function() {
      app.$chats.html('');
    },
    addMessage: function(result) {
      result.roomname = result.roomname || "lobby";
      result.text = (result.text || result.result || "").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

      if(result.roomname === app.currentRoom) {
        var $chat = $('<div class="chat"></div>');
        var $username = $('<span class="username">' + result.username + '</span>');
        var $text = $('<br/><span class="message">' + result.text + '</span>');

        $chat.addClass(result.roomname);
        $username.attr('data-username', result.username);

        if(app.friends[result.username] === true) {
          $username.addClass('friends');
        }

        $username.on('click', function() {
          app.addFriend($(this).attr('data-username'));
        });

        $chat.append($username, $text);
        app.$chats.append($chat);
      }
    },
    addRoom: function(room) {
      var newOption = $('<option>' + room + '</option>');
      app.$roomSelect.append(newOption);
    },
    addFriend: function(username) {
      app.friends[username] = true;
      $('[data-username="' + username + '"]').addClass('friends');
    },
    handleSubmit: function() {
      var messageObj = {
        text: app.$message.val(),
        username: app.username,
        roomname: app.$roomSelect.val()
      };
      app.currentRoom = app.$roomSelect.val();
      app.send(messageObj);
    }
  };

  app.init();

}());
