
class MessageController {
  
  constructor(messageModel, userModel, observerService) {
    this.messageModel = messageModel;
    this.userModel = userModel;
    this.observerService = observerService;
  }

  async postMessage(req, res) {

    const { message } = req.body;
    const userId = req.user._id;
    const user = await this.userModel.findById(userId);
    

    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    try {
      const newMessage = await this.messageModel.createMessage({
        message,
        user: userId,
      });

      const data = {
        data: newMessage,
        user: user.username
      }
      // Notify all connected clients (observers) about the new message
      this.notifyObservers(data);

      res.status(201).json({
        message: "Message posted successfully!",
        data,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Observer Design Pattern: Notify all connected clients of the new message
  notifyObservers(message) {
    
    this.observerService.getAll().forEach(observer => {
        observer.emit('newMessage', message); // Send the message to all connected clients
    });
    
}

  async getMessagesByUser(req, res) {
    try {
      const userId = req.params.userId || req.user._id;
      const messages = await this.messageModel.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllMessages(req, res) {
    try {
      const messages = await this.messageModel.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = MessageController;
