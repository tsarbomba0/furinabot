const websock = require('ws')
let ws = new websock("ws://localhost:8181")

console.log("On!")
ws.on('open', function open() {
    console.log("Connected!")
  });
  
ws.on('message', function message(data) {
    console.log('received: %s', data);
});

ws.on('close', () => {
  console.log("closed connection, trying to reconnect")
  ws = new websock("ws://localhost:8181")
})

ws.on('error', () => {
  console.log("closed connection, trying to reconnect")
  
})

