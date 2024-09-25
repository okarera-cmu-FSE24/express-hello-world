const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const { log } = require('console');


//Configurations
const io = new Server(server,{
  cors: {
    origin: 'http://127.0.0.1:5500', // Allowing requests from this localhost (5500 port)
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middlewares
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));


// Session middleware 
const sessionMiddleware = session({
  secret: "snfksdmsmkfnslkow4k924u9fsmknvwk#EQ#4vwsxbvks(",
  resave: false,
  saveUninitialized: false,
 
});
app.use(sessionMiddleware);

app.set('sessionMiddleware', sessionMiddleware);
io.use(
  sharedSession(sessionMiddleware,{
    autoSave: true
  })
);

// Routes
app.use(authRoutes);
app.use(chatRoutes);


// Handling Socket.IO connections
io.on('connection', (socket) => {
  console.log('user connected');

  // Listening for chatMessage event and save it with the username from session
  socket.on('chatMessage', async (msg) => {

    if (!msg.username) {
      
      socket.emit('errorMessage', 'You need to be logged in to send messages');
      return;
    }

    // Saving the message with the username
    const message = new Message(msg.username, msg.text);
    const savedMessage = await message.save();
    
    // Broadcasting the message
    io.emit('message', { 
      username: message.username, 
      text: msg.text, 
      created_at: new Date().toLocaleString() 
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
