'use strict';

const chat = document.querySelector('.chat');
const messageBox = chat.querySelector('.message-box');
const messageInput = chat.querySelector('.message-input');
const messageSubmit = chat.querySelector('.message-submit');
const messagesContent = chat.querySelector('.messages-content');
const messagesTemplates = chat.querySelector('.messages-templates');

const chatStatus = chat.querySelector('.chat-status');
const messageStatus = chat.querySelector('.message-status');
const connection = new WebSocket('wss://neto-api.herokuapp.com/chat');

function setStatus(event) {
  if (event.type === 'open') {
    chatStatus.textContent = chatStatus.dataset.online;
    messageSubmit.removeAttribute('disabled');
    messageStatus.firstElementChild.textContent = 'Пользователь появился в сети';
    messagesContent.appendChild(messageStatus.cloneNode(true));
  } else if (event.type === 'close') {
    chatStatus.textContent = chatStatus.dataset.offline;
    messageSubmit.setAttribute('disabled', 'disabled');
    messageStatus.firstElementChild.textContent = 'Пользователь не в сети';
    messagesContent.appendChild(messageStatus.cloneNode(true));
  }
}

function showMessage(messageText, className) {
  let node = className ? messagesTemplates.querySelector('.message-personal') : messagesTemplates.querySelectorAll('.message')[1];
  let justNow = (new Date()).toLocaleTimeString().substr(0, 5);
  node.querySelector('.message-text').textContent = messageText.data ? messageText.data : messageText;
  node.querySelector('.timestamp').textContent = justNow;
  let cloneNode = node.cloneNode(true);
  messagesContent.append(cloneNode);

  if (cloneNode.previousElementSibling.classList.contains('loading')) {
    cloneNode.parentElement.removeChild(cloneNode.previousElementSibling);
  }
}

function getMessage(event) {
  const messageText = event.data;

  if (messageText === 'Удачи') {
    connection.close();
  }

  if (messageText === '...') {
    let messageLoading = chat.querySelector('.message.loading');
    let clone = messageLoading.cloneNode(true);
    messagesContent.append(clone);
  } else {
    showMessage(messageText, false);
  };
}

function sendMessage(event) {
  event.preventDefault();
  const messageText = messageInput.value;

  if (!messageText) {
    return;
  }

  connection.send(messageText);
  messageInput.value = '';
  showMessage(messageText, true);
}

connection.addEventListener('open', setStatus);
connection.addEventListener('close', setStatus);
connection.addEventListener('error', event => {})
connection.addEventListener('message', getMessage);
messageBox.addEventListener('submit', sendMessage);
