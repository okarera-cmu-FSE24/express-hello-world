const MessageModel = require("../models/Message");
const MessageService = require("../models/Message");

class MessageController {
  async postMessage(req, res) {
    const { message } = req.body;

    console.log(req);

    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ message: "Message content is required" });
    }

    try {
      const newMessage = await MessageModel.createMessage({
        message,
        user: userId,
      });

      res.status(201).json({
        message: "Message posted successfully!",
        data: newMessage,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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
