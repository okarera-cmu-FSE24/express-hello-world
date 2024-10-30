// ChatPrivatelyController.js
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

        res.status(200).json({
          display: messages.length > 0 ? 'chatWall' : 'emptyChatWall',
          messages
        });
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

        // Emit to both users' rooms
        const room = `${sendingUserName}-${receivingUserName}`;
        const reverseRoom = `${receivingUserName}-${sendingUserName}`;
        io.to(room).to(reverseRoom).emit("privateMessage", message);

        res.status(201).json({
          message: 'Message sent successfully',
          data: message,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
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