'use strict';

const connection = new WebSocket('wss://neto-api.herokuapp.com/counter');

connection.addEventListener('message', event => {
  const connections = document.querySelector('.counter');
  const errors = document.querySelector('output.errors');
  const message = JSON.parse(event.data);

  connections.textContent = message.connections;
  errors.textContent = message.errors;
});

window.addEventListener('unload', () => {
  connection.addEventListener('error', event => {});
  connection.close(1000);
})
