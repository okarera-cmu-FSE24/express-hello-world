const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const { Server } = require('socket.io'); 
const cors = require('cors');
const observers = require('./services/Observers')
const app = express();
const server = http.createServer(app);


dotenv.config();


const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: '*',
        credentials: true,
    },
});

//Middlewares configuration
app.use(cors());
app.use(express.json());


// MongoDB connection

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/users/', userRoutes);
app.use('/messages/', messageRoutes); 


io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Adding the new connected client to observers list
    observers.add(socket);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        observers.remove(socket.id);
    });
});

// Starting the server
const PORT = process.env.PORT || 5000;
// mongoose.connection.once('open',()=>{
server.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
// })

console.log('observers');
console.log(observers);


module.exports = observers;