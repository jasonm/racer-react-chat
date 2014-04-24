/** @jsx React.DOM */

/////////////////////////////////////////////
// React components
//
var ChatApp = React.createClass({
  render: function() {
    if (!this.state || !this.state.model) {
      return (<div>loading...</div>);
    }

    var room = this.state.model.at('rooms.1'),
        currentUser = this.state.model.at('users.' + this.state.uid),
        userState = this.state.model.at('userstate.' + this.state.uid

    return (
      <div className="chat-app-view">
        <header>
          Logged in as: { currentUser.get('name') }
        </header>
        <RoomList 
        <ChatRoom room={room} currentUser={ currentUser } />
      </div>
    );
  }
});

var ChatRoom = React.createClass({
  render: function() {
    return (
      <div className="chat-room-view">
        <div className="topic">Room: {this.props.room.get('topic')}</div>
        <ChatHistory
          chats={this.props.room.at('chats')}
          />
        <ChatInput
          room={this.props.room}
          currentUser={this.props.currentUser}
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
    var roomId = this.props.room.get('id'),
        currentUserId = this.props.currentUser.get('id');

    appModel.add("rooms." + roomId + ".chats", {
      id: cuid(),
      userId: currentUserId,
      text: text,
      time: new Date()
    });
  },

  render: function() {
    return (
      <div className="chat-input-view">
        <span className="user-name">{ this.props.currentUser.get("name") }:</span>
        <input onKeyUp={this.onKeyUp} type="text" />
      </div>
    );
  }
});

var ChatHistory = React.createClass({
  render: function() {
    // Note the distinction between Racer scoped models (the usual)
    // and deref'd chatAttributes hashes.
    var lineNodes = _.chain(this.props.chats.get()).
                      sortBy(function(chatAttributes) { return new Date(chatAttributes.time); }).
                      map(function(chatAttributes) { return this.props.chats.at(chatAttributes.id); }.bind(this)).
                      map(function(chat) {
                       return (<ChatLine chat={chat} key={chat.get('id')} />);
                      }).
                      value();

    return (
      <div className="chat-history-view">
        {lineNodes}
      </div>
    );
  },

  // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },

  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    }
  },

  componentDidMount: function() {
    var node = this.getDOMNode();
    node.scrollTop = node.scrollHeight;
  }
});

var ChatLine = React.createClass({
  render: function() {
    // TODO can this be improved by hydrating the JSON model with Racer refs, BBR-style?
    var user = appModel.at('users.' + this.props.chat.get('userId'));

    return (
      <div className="chat-line-view">
        <span className="name">{ user.get('name') }: </span>
        <span className="chat">{ this.props.chat.get('text') }</span>
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

  appModel.set(state);
}

/////////////////////////////////////////////
// Bootstrap app
//
var app,
    appModel,
    currentUserId = query['userId'] || 1;

window.racer.ready(function(model) {

  appModel = model.at('_page.chats');

  window.m = appModel;

  if (!appModel.get()) {
    loadFixtureAppState();
  }

  app = React.renderComponent(
    <ChatApp />,
    document.getElementById('example')
  );

  app.setState({
    model: appModel,
    uid: currentUserId
  });

  // We could be more finely-grained, but React's rendering is sufficiently fast and stable for now
  appModel.on("all", "**", function () {
    console.log("appModel event: ", arguments)
    app.setState({ model: appModel });
  });
});
