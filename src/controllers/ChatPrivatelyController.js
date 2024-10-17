function createChatPrivatelyController(privateMessageService, userService, io) {
    return {
      async initiatePrivateChat(req, res) {
        const { userName1, userName2 } = req.params;
  
        try {
          const user1 = await userService.findByUsername(userName1);
          const user2 = await userService.findByUsername(userName2);
  
          if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
          }
  
          const messages = await privateMessageService.getMessagesBetweenUsers(user1._id, user2._id);
  
          if (messages.length > 0) {
            res.status(200).json({ display: 'chatWall', messages });
          } else {
            res.status(200).json({ display: 'emptyChatWall' });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
  
      async sendMessage(req, res) {
        const { sendingUserName, receivingUserName, content } = req.body;
  
        try {
          const sender = await userService.findByUsername(sendingUserName);
          const receiver = await userService.findByUsername(receivingUserName);
  
          if (!sender || !receiver) {
            return res.status(404).json({ message: 'One or both users not found' });
          }
  
          const message = await privateMessageService.createMessage({
            content,
            sender: sender._id,
            receiver: receiver._id,
          });
  
          // Notify the receiving user in real time
          this.notifyUser(receiver.username, message);
  
          res.status(201).location(`/messages/private/${sendingUserName}/${receivingUserName}`).json({
            message: 'Message sent successfully',
            data: message,
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
  
      notifyUser(receiverName, message) {
        io.to(receiverName).emit('newMessage', message);
      },
  
      async getPrivateMessages(req, res) {
        const { userName1, userName2 } = req.params;
  
        try {
          const user1 = await userService.findByUsername(userName1);
          const user2 = await userService.findByUsername(userName2);
  
          if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
          }
  
          const messages = await privateMessageService.getMessagesBetweenUsers(user1._id, user2._id);
  
          res.status(200).json(messages);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
  
      async getNewMessage(req, res) {
        const { userName1, userName2 } = req.params;
  
        try {
          const user1 = await userService.findByUsername(userName1);
          const user2 = await userService.findByUsername(userName2);
  
          if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
          }
  
          const latestMessage = await privateMessageService.getLatestMessage(user1._id, user2._id);
  
          res.status(200).json(latestMessage);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
  
      async getUsersPrivateChats(req, res) {
        const { userName } = req.params;
  
        try {
          const user = await userService.findByUsername(userName);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
  
          const uniqueUsers = await privateMessageService.getUsersPrivateChats(user._id);
  
          res.status(200).json(uniqueUsers);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    };
  }
  
  module.exports = createChatPrivatelyController;