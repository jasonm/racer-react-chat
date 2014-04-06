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

    update(function() {
      appModel.add("rooms." + roomId + ".chats", {
        id: cuid(),
        userId: userId,
        text: text,
        time: new Date()
      });
    });
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
    var lineNodes = _.sortBy(this.props.chats, function(chat) { return chat.time; }).
                      map(function(chat) {
                       return (<ChatLine appState={this.props.appState}
                                         localState={this.props.localState}
                                         chat={chat}
                                         key={chat.id} />);
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
    var user = this.props.appState.users[this.props.chat.userId];

    return (
      <div className="chat-line-view">
        <span className="name">{ user.name }: </span>
        <span className="chat">{ this.props.chat.text }</span>
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

var app,
    appModel,
    currentUserId = query['userId'] || 1;

function update(mutator) {
  // single point of change - yagni?
  mutator();
}

/////////////////////////////////////////////
// Fixture data to play with
//
function loadFixtureAppState() {
  var state = {
    rooms: {
      1: {
        id: 1,
        topic: "foo",
        chats: {}
      }
    },

    users: {
      1: { id: 1, name: "Alice" },
      2: { id: 2, name: "Bob" },
      3: { id: 3, name: "Cecilia" }
    }
  };

  function addChat(obj) {
    state.rooms[1].chats[obj.id] = obj;
  }

  addChat({ id: cuid(), userId: 1, text: "Hi there",    time: new Date(new Date() - (4 * 60 * 1000)) });
  addChat({ id: cuid(), userId: 2, text: "Well hello",  time: new Date(new Date() - (4 * 60 * 1000)) });
  addChat({ id: cuid(), userId: 1, text: "How are you", time: new Date(new Date() - (4 * 60 * 1000)) });
  addChat({ id: cuid(), userId: 3, text: "Oh hey guys", time: new Date(new Date() - (4 * 60 * 1000)) });

  update(function() {
    appModel.set(state);
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

  app = React.renderComponent(
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

  // We could be more finely-grained, but React's rendering is sufficiently fast and stable for now
  appModel.on("all", "**", function () {
    console.log("appModel event: ", arguments)
    app.setState({ appState: appModel.get() });
  });
});
