/** @jsx React.DOM */

React = require("react");


window.HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
      Hello, <input type="text" placeholder="Your name here" />!
      It is {this.props.date.toTimeString()}
      </p>
      );
  }
});


React.renderComponent(
  <HelloWorld date={new Date()} />,
  document.getElementById('example')
);
