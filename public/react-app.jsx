/** @jsx React.DOM */

/////////////////////////////////////////////
// React components
//
var ChatApp = React.createClass({
  render: function() {
    if (!this.state || !this.state.appState) {
      return (<div>loading...</div>);
    }

    var room = this.state.appState.rooms[1];

    return (
      <div className="chat-app-view">
        <header>
          Logged in as: { this.state.localState.currentUser.name }
        </header>
        <ChatRoom appState={this.state.appState}
                  localState={this.state.localState}
                  room={room} />
      </div>
    );
  }
});

var ChatRoom = React.createClass({
  render: function() {
    return (
      <div className="chat-room-view">
        <div className="topic">Room: {this.props.room.topic}</div>
        <ChatHistory
          appState={this.props.appState}
          localState={this.props.localState}
          chats={this.props.room.chats}
          />
        <ChatInput
          appState={this.props.appState}
          localState={this.props.localState}
          room={this.props.room}
          />
      </div>
    );
  }
});

var ChatInput = React.createClass({
  onKeyUp: function(e) {
    if (e.which === 13) {
      this.postChat(e.target.value);
      e.target.value = "";
    }
  },

  postChat: function(text) {
    var roomId = this.props.room.id,
        userId = this.props.localState.currentUser.id;

    update(function(state) {
      state.rooms[roomId].chats.push({
        id: state.rooms[roomId].chats.length + 1,
        userId: userId,
        text: text,
        time: new Date()
      });

      return state;
    }.bind(this));
  },

  render: function() {
    return (
      <div className="chat-input-view">
        <span className="user-name">{ this.props.localState.currentUser.name }:</span>
        <input onKeyUp={this.onKeyUp} type="text" />
      </div>
    );
  }
});

var ChatHistory = React.createClass({
  render: function() {
    var lineNodes = this.props.chats.map(function(message) {
      return <ChatLine appState={this.props.appState}
                       localState={this.props.localState}
                       message={message}
                       key={message.id} />;
    }.bind(this));

    return (
      <div className="chat-history-view">
        {lineNodes}
      </div>
    );
  }
});

var ChatLine = React.createClass({
  render: function() {
    var user = this.props.appState.users[this.props.message.userId];

    return (
      <div className="chat-line-view">
        <span className="name">{ user.name }: </span>
        <span className="message">{ this.props.message.text }</span>
      </div>
    );
  }
});

/////////////////////////////////////////////
// QueryString
//
function getQueryParams(qs) {
  qs = qs.split("+").join(" ");

  var params = {}, tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

var query = getQueryParams(document.location.search);

/////////////////////////////////////////////
// Application state management
//

// var app,
var appModel,
    currentUserId = query['userId'] || 1;

function update(mutator) {
  var newState = mutator(appModel.get());
  appModel.set(newState);
}

function loadFixtureAppState() {
  appModel.set({
    rooms: {
      1: {
        id: 1,
        topic: "foo",
        chats: [
          { id: 1, userId: 1, text: "Hi there",    time: new Date(new Date() - (4 * 60 * 1000)) },
          { id: 2, userId: 2, text: "Well hello",  time: new Date(new Date() - (3 * 60 * 1000)) },
          { id: 3, userId: 1, text: "How are you", time: new Date(new Date() - (2 * 60 * 1000)) },
          { id: 4, userId: 3, text: "Oh hey guys", time: new Date(new Date() - (1 * 60 * 1000)) },
        ]
      }
    },

    users: {
      1: { id: 1, name: "Alice" },
      2: { id: 2, name: "Bob" },
      3: { id: 3, name: "Cecilia" }
    }
  });
}

/////////////////////////////////////////////
// Bootstrap app
//
window.racer.ready(function(model) {
  appModel = model.at('_page.chats');

  if (!appModel.get()) {
    loadFixtureAppState();
  }

  var app = React.renderComponent(
    <ChatApp />,
    document.getElementById('example')
  );

  var appState = appModel.get(),
      localState = {
        currentUser: appState.users[currentUserId]
      };

  app.setState({
    appState: appState,
    localState: localState
  });

  appModel.on('change', function(newState) {
    app.setState({
      appState: newState,
    });
  });
});
