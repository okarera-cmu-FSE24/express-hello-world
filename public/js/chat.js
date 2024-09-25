// Initializing Socket.IO
const socket = io('http://localhost:3001');

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const messagesList = document.getElementById('messagesList');


// Listening for incoming messages and append them to the chat
socket.on('message', (message) => {
  const listItem = document.createElement('li');
  listItem.classList.add("chat-message")
  const username = message.username === localStorage.getItem("username")? "Me": message.username
  if (username === "Me"){
    listItem.classList.add("chat-message-me")
  }
  listItem.innerHTML = `
  <p class="text" id="text">${message.text}</p>
          <div class="username-time">
              <p id="username">${username}</p>
              <p id="time">${formatTime(message.created_at)}</p>
          </div>
  `
  messagesList.appendChild(listItem);
});

// Sending message when form is submitted
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = chatInput.value;
  if (text.trim() !== '') {
    socket.emit('chatMessage', { username: localStorage.getItem('username'), text });
    chatInput.value = '';
  }
});

// Loading all previous messages when the page loads
window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('http://localhost:3001/messages/');
  const messages = await response.json();
  
  messages.forEach(message => {
    const listItem = document.createElement('li');
    listItem.classList.add("chat-message")
    const username = message.username === localStorage.getItem("username")? "Me": message.username
    if (username === "Me"){
      listItem.classList.add("chat-message-me")
    }
    listItem.innerHTML = `
    <p class="text" id="text">${message.text}</p>
            <div class="username-time">
                <p id="username">${username}</p>
                <p id="time">${formatTime(message.created_at)}</p>
            </div>
    `
    messagesList.appendChild(listItem);
  });
});


// Function that format well the time 
function formatTime(timestamp) {
  const date = new Date(timestamp);

  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Add leading zero if necessary
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
}

//Logout Handler
document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('http://localhost:3001/logout/', {
    method: 'POST',
    credentials: 'include' 
  })
  .then(response => response.text())
  .then(message => {
    console.log(message);
    
    window.location.href = 'login.html'; 
  })
  .catch(error => {
    console.error('Logout error:', error);
  });
});