'use strict';

const connection = new WebSocket('wss://neto-api.herokuapp.com/mouse');

connection.addEventListener('open', (event) => showBubbles(event.currentTarget));

window.addEventListener('click', (event) => {
  connection.send(JSON.stringify({
    x: event.pageX,
    y: event.pageY
  }));
});
