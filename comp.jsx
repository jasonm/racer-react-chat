/** @jsx React.DOM */

// This doesn't work, but setting window.React=require("react") in client.js works ok...??
// React = require("react");
// This would give:
// Error: module "./focusNode" not found from "/Users/jason/dev/racer-playground/racer-pad-react/comp.js"
//    at .../node_modules/racer/node_modules/browserify/index.js:587:23
//    at .../node_modules/racer/node_modules/browserify/node_modules/browser-resolve/index.js:183:24
//    at .../node_modules/racer/node_modules/browserify/node_modules/browser-resolve/node_modules/resolve/lib/async.js:36:22
//    at ...-react/node_modules/racer/node_modules/browserify/node_modules/browser-resolve/node_modules/resolve/lib/async.js:54:43)
//    at load (.../node_modules/racer/node_modules/browserify/node_modules/browser-resolve/node_modules/resolve/lib/async.js:54:43)
//    at .../node_modules/racer/node_modules/browserify/node_modules/browser-resolve/node_modules/resolve/lib/async.js:60:22
//    at .../node_modules/racer/node_modules/browserify/node_modules/browser-resolve/node_modules/resolve/lib/async.js:16:47
//    at Object.oncomplete (fs.js:107:15)

window.HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
      HEYYY, <input type="text" placeholder="Your name here" />!
      It is {this.props.date.toTimeString()}
      </p>
      );
  }
});


React.renderComponent(
  <HelloWorld date={new Date()} />,
  document.getElementById('example')
);
