const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const { Server } = require('socket.io'); 
const cors = require('cors');
const { log } = require('console');



dotenv.config();

const app = express();

const server = http.createServer(app);

//Middlewares configuration
app.use(cors());
app.use(express.json());


const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: '*',
        credentials: true,
    },
});



// MongoDB connection

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/users/', userRoutes);
app.use('/messages/', messageRoutes); 

// Observer list to store connected clients
let observers = [];

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Adding the new connected client to observers list
    observers.push(socket);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        observers = observers.filter((observer) => observer.id !== socket.id);
    });
});

// Starting the server
const PORT = process.env.PORT || 5000;
mongoose.connection.once('open',()=>{
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
})


module.exports = observers;