const websock = require('ws')
const ws = new websock("ws://localhost:8181")

console.log("On!")
ws.on('open', function open() {
    console.log("Connected!")
  });
  
ws.on('message', function message(data) {
    console.log('received: %s', data);
});