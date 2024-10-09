const UserService = require('../models/User');  // Use the UserService
const PrivateMessageService = require('../services/PrivateMessageService');  
const { io } = require('../index'); 

class ChatPrivatelyController {
    // Initiate private chat and return messages between two users
    async initiatePrivateChat(req, res) {
        const { userName1, userName2 } = req.params;

        try {
            const user1 = await UserService.findByUsername(userName1);
            const user2 = await UserService.findByUsername(userName2);

            if (!user1 || !user2) {
                return res.status(404).json({ message: 'One or both users not found' });
            }

            const messages = await PrivateMessageService.getMessagesBetweenUsers(user1._id, user2._id);

            if (messages.length > 0) {
                res.status(200).json({ display: 'chatWall', messages });
            } else {
                res.status(200).json({ display: 'emptyChatWall' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Send a private message between two users
    async sendMessage(req, res) {
        const { sendingUserName, receivingUserName, content } = req.body;

        try {
            const sender = await UserService.findByUsername(sendingUserName);
            const receiver = await UserService.findByUsername(receivingUserName);

            if (!sender || !receiver) {
                return res.status(404).json({ message: 'One or both users not found' });
            }

            const message = await PrivateMessageService.createMessage({
                content,
                sender: sender._id,
                receiver: receiver._id,
            });

            // Notify the receiving user in real time
            // this.notifyUser(receiver.username, message);

            res.status(201).location(`/messages/private/${sendingUserName}/${receivingUserName}`).json({
                message: 'Message sent successfully',
                data: message,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Notify a user about a new message in real-time using socket.io
    notifyUser(receiverName, message) {
        io.to(receiverName).emit('newMessage', message);
    }

    // Get all private messages between two users
    async getPrivateMessages(req, res) {
        const { userName1, userName2 } = req.params;

        try {
            const user1 = await UserService.findByUsername(userName1);
            const user2 = await UserService.findByUsername(userName2);

            if (!user1 || !user2) {
                return res.status(404).json({ message: 'One or both users not found' });
            }

            const messages = await PrivateMessageService.getMessagesBetweenUsers(user1._id, user2._id);

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get the latest message between two users
    async getNewMessage(req, res) {
        const { userName1, userName2 } = req.params;

        try {
            const user1 = await UserService.findByUsername(userName1);
            const user2 = await UserService.findByUsername(userName2);

            if (!user1 || !user2) {
                return res.status(404).json({ message: 'One or both users not found' });
            }

            const latestMessage = await PrivateMessageService.getLatestMessage(user1._id, user2._id);

            res.status(200).json(latestMessage);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get the list of all users with whom the given user has privately chatted
    async getUsersPrivateChats(req, res) {
        const { userName } = req.params;

        try {
            const user = await UserService.findByUsername(userName);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const uniqueUsers = await PrivateMessageService.getUsersPrivateChats(user._id);

            res.status(200).json(uniqueUsers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ChatPrivatelyController();
