What is it?
-----------

An experiment with Derby's [Racer](http://derbyjs.com/#models) and Facebook
[React](http://facebook.github.io/react/docs/two-way-binding-helpers.html).
Super work-in-progress and probably messy.

Views are rendered as pure functions of model state.  I would like to work toward an [Om](https://github.com/swannodette/om)-like global state + cursor approach.  This is likely possible using Racer's [paths](http://derbyjs.com/#paths) and [model scopes](http://derbyjs.com/#scoped_models).

Racer syncs underlying models using [JSON-OT](https://github.com/share/ottypes/wiki/JSON-operations) to resolve conflicts in the face of latency and even connectivity loss.

Racer's default communication layer uses [Google BrowserChannel](http://closure-library.googlecode.com/svn-history/r144/docs/closure_goog_net_browserchannel.js.html) which uses XHR, so I added [SPDY](http://en.wikipedia.org/wiki/SPDY) so they are pipelined TO THE MAX.  (Unclear if this actually provides a benefit above HTTP/1.1 pipelining; I did zero benchmarking).

Model identifiers are generated on the client with [cuid](https://github.com/dilvie/cuid).

Reading
-------

See `./public/react-app.jsx` for the interesting stuff.

Running
-------

```
npm install
node server.js
```

TODO / Thoughts
---------------

* Is it advantageous to rely on the ShareJS document version to inform `shouldComponentUpdate`?  If our state is purely defined in terms of ShareJS documents, then rendering should never get triggered except during state change, so this would not provide an improvement I think.  Neat idea though, and accessible as `appModel._getOrCreateShareDoc('chats', 'chatsdoc').version`  Maybe this becomes more interesting when both local and shared state change independently and we can short-circuit `shouldComponentUpdate` for some components.
* Correctly use collections to allow multiple rooms and room listing
* Add some sort of auth for users
* Implement global-presence and room-presence

Tech/learning experiments:

* Support multiple chat rooms
  _ react room-chooser
  _ per-user state for which-room-am-i-viewing (per-user instead of unshared for persistence across browsers/devices)
  _ per-user state in different collection where you can use racer-access to limit access?
* Think about reffing models from a root document
* Use reactive functions http://derbyjs.com/#reactive_functions
