

const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectToDatabase } = require('./services/dbConnectionService');
const privateHandleSocket = require('./SocketHandlers/privateSocketHandlers');

// Import factories
const userRoutesFactory = require('./routes/userRoutes');
const messageRoutesFactory = require('./routes/messageRoutes');
const statusRoutesFactory = require('./routes/statusRoutes');
const privateMessageRoutesFactory = require('./routes/privateMessageRoutes');

// Import service factories
const createUserService = require('./services/UserService');
const createMessageService = require('./services/MessageService');
const createStatusService = require('./services/StatusService');
const createPrivateMessageService = require('./services/PrivateMessageService');
const createObserverService = require('./services/ObserverService');

// Import controller factories
const createUserController = require('./controllers/UserController');
const createMessageController = require('./controllers/MessageController');
const createStatusController = require('./controllers/StatusController');
const createChatPrivatelyController = require('./controllers/ChatPrivatelyController');

// Import middleware
const createProtectMiddleware = require('./middlewares/authMiddleware');

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

// Middlewares configuration
app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        const connection = await connectToDatabase(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userService = createUserService(connection);
        const messageService = createMessageService(connection, userService);
        const statusService = createStatusService(connection);
        const privateMessageService = createPrivateMessageService(connection);
        const observerService = createObserverService();

        const protect = createProtectMiddleware(userService);

        const userController = createUserController(userService);
        const messageController = createMessageController(userService, messageService, observerService, io);
        const statusController = createStatusController(statusService, userService);
        const chatPrivatelyController = createChatPrivatelyController(privateMessageService, userService, io);

        // Set up routes using factories
        app.use('/users', userRoutesFactory(userController, protect));
        app.use('/users',privateMessageRoutesFactory(chatPrivatelyController, protect));
        app.use('/messages', messageRoutesFactory(messageController, protect));
        app.use('', statusRoutesFactory(statusController, protect));
        app.use('/messages',privateMessageRoutesFactory(chatPrivatelyController, protect));

        io.on('connection', (socket) => {
            console.log('New client connected');

            privateHandleSocket(io, socket);
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

        if(process.env.NODE_ENV !== 'test'){
            const PORT = process.env.PORT || 5000;
            server.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
        }

    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
}

startServer();

module.exports = { io, app };
