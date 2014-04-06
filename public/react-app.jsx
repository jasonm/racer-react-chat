/** @jsx React.DOM */

// var HelloWorld = React.createClass({
//   render: function() {
//     return (
//       <p>
//       West, <input type="text" placeholder="Your name here" />!
//       It is {this.props.date.toTimeString()}
//       </p>
//       );
//   }
// });

var updateImm, update;

var ChatApp = React.createClass({
  render: function() {
    var room = this.props.appState.rooms[1];

    return (
      <ChatRoom appState={this.props.appState}
                localState={this.props.localState}
                room={room} />
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
    }.bind(this));
  },

  render: function() {
    return (
      <div className="chat-input-view">
        <span className="user-name">{ this.props.localState.currentUser.name }:</span>
        <input onKeyUp={this.onKeyUp} type="text" placeholder="Chat message" />
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
var appState = {};

appState.rooms = {
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
}

appState.users = {
  1: { id: 1, name: "Alice" },
  2: { id: 2, name: "Bob" },
  3: { id: 3, name: "Cecilia" }
}

var localState = {};

localState.currentUser = appState.users[1];

var app = React.renderComponent(
  <ChatApp appState={appState} localState={localState} />,
  document.getElementById('example')
);

// updateImm = function(applier) {
//   var newAppState = applier(appState);
//   app.setState({ appState: newAppState });
//   appState = newAppState;
// };

update = function(mutator) {
  mutator(appState);
  app.setState({ appState: appState });
};
