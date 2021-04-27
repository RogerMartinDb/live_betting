# PoC for Browser synchronising stream with initial state

## To run:

```
bundle install
yarn install
rails server
```

Open http://localhost:3000/ in a browser and view JavaScript console to see what's going on.

Hit "Start" button on page to start the stream on the server (would not really be a button on web page)

Open same URL in a second browser. Initially it will poll and show a similar color as first browser, but eventually it will line up with the stream and switch to streaming mode and show same color as first browser

# What it's trying to show

On server there is a generated event stream where each event is a change in color. First ever color state is 0, and each color change is XORed with current color to get next color.

The color state (aka "Projection") as at a point in the stream is the acumalation of all XORed color changes since the begining up to that point.

If you know the projection (current color) as at a particlar point in the stream and you know all the events on the stream since then, you can calcualte the current color without knowing all the changes since first ever.

On the browser, the main code is in `stream_coordinator.js`. It polls the server to get the most recent cached color state every 5 seconds, and updates the displayed color. It also connects a web socket and receives color change events on the stream. While in `polling` mode it buffers the incomming events in `this.eventBuffer` (which is an array but it using a linkded-list-like `push()` method as Wanderson had suggested). Once the buffered stream and a polled cached projection can be lined up it runs throught the buffered backlog and switches to `streaming` mode.

It has the advantage that the stream is purely public and very simple.
