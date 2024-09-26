const MessageModel = require("../models/Message");
const MessageService = require("../models/Message");
const observers = require('../services/Observers');
const UserService = require('../models/User'); 

class MessageController {
  async postMessage(req, res) {
    const { message } = req.body;

    const userId = req.user._id;
    const user = await UserService.findById(userId);
    

    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    try {
      const newMessage = await MessageModel.createMessage({
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
    
    observers.getAll().forEach(observer => {
        observer.emit('newMessage', message); // Send the message to all connected clients
    });
    
}

  async getMessagesByUser(req, res) {
    try {
      const userId = req.params.userId || req.user._id;
      const messages = await MessageService.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllMessages(req, res) {
    try {
      const messages = await MessageService.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MessageController();
