function createMessageController(userService, messageService, observerService, io) {
  return {
    async postMessage(req, res) {
      const { message } = req.body;
      const userId = req.user._id;
      const user = await userService.findById(userId);
      
      if (!message) {
        return res.status(400).json({ message: "Message content is required" });
      }
function createMessageController(userService, messageService, observerService, io) {
  return {
    async postMessage(req, res) {
      const { message } = req.body;
      const userId = req.user._id;
      const user = await userService.findById(userId);
      
      if (!message) {
        return res.status(400).json({ message: "Message content is required" });
      }

      io.on('connection', (socket) => {
        socket.on('newPublicMessage', async (message) => {
          io.emit('publicBroadcastMessage', message); // Send the message to all connected clients
        });
      });

      try {
        const newMessage = await messageService.createMessage({
          message,
          user: userId,
        });

        const data = {
          data: newMessage,
          user: user.username
        }
        

        res.status(201).json({
          message: "Message posted successfully!",        
          data,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
        res.status(201).json({
          message: "Message posted successfully!",        
          data,
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },

    // // Observer Design Pattern: Notify all connected clients of the new message
    // notifyObservers(message) {
    //   observerService.getAll().forEach(observer => {
    //     io.to(observer.id).emit('newMessage', message); // Send the message to all connected clients
    //   });
    // },

    async getMessagesByUser(req, res) {
      try {
        const userId = req.params.userId || req.user._id;
        const messages = await messageService.getMessagesByUser(userId);
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
    async getMessagesByUser(req, res) {
      try {
        const userId = req.params.userId || req.user._id;
        const messages = await messageService.getMessagesByUser(userId);
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },

    async getAllMessages(req, res) {
      try {
        const messages = await messageService.getAllMessages();
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  };
    async getAllMessages(req, res) {
      try {
        const messages = await messageService.getAllMessages();
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  };
}

module.exports = createMessageController;
module.exports = createMessageController;