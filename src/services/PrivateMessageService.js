<<<<<<< HEAD
// services/PrivateMessageService.js
const PrivateMessageModel = require('../models/PrivateMessage');

class PrivateMessageService {
  async createMessage(data) {
    // Create a new private message using the PrivateMessageModel
    return await PrivateMessageModel.create(data);
  }

  async getMessagesBetweenUsers(senderId, receiverId) {
    // Fetch messages between two users
    return await PrivateMessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).populate('sender', 'username').populate('receiver', 'username');
  }

  async getLatestMessage(senderId, receiverId) {
    // Get the latest message between two users
    return await PrivateMessageModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'username')
    .populate('receiver', 'username');
  }

  async getUsersPrivateChats(userId) {
    // Fetch all users a given user has chatted with
    const messages = await PrivateMessageModel.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    }).populate('sender', 'username').populate('receiver', 'username');

    const uniqueUsers = new Set();
    messages.forEach((message) => {
      uniqueUsers.add(message.sender.username);
      uniqueUsers.add(message.receiver.username);
    });

    return Array.from(uniqueUsers);
  }
}

module.exports = new PrivateMessageService();
=======

function createPrivateMessageService(connection) {
  const { getModel: getPrivateMessageModel } = require('../models/PrivateMessage');
  const PrivateMessageModel = getPrivateMessageModel(connection);

  return {
    async createMessage(data) {
      return await PrivateMessageModel.create(data);
    },

    async getMessagesBetweenUsers(senderId, receiverId) {
      return await PrivateMessageModel.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      }).populate('sender', 'username').populate('receiver', 'username');
    },

    async getLatestMessage(senderId, receiverId) {
      return await PrivateMessageModel.findOne({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
      .sort({ createdAt: -1 })
      .populate('sender', 'username')
      .populate('receiver', 'username');
    },

    async getUsersPrivateChats(userId) {
      const messages = await PrivateMessageModel.find({
        $or: [
          { sender: userId },
          { receiver: userId },
        ],
      }).populate('sender', 'username').populate('receiver', 'username');

      const uniqueUsers = new Set();
      messages.forEach((message) => {
        uniqueUsers.add(message.sender.username);
        uniqueUsers.add(message.receiver.username);
      });

      return Array.from(uniqueUsers);
    }
  };
}

module.exports = createPrivateMessageService;
>>>>>>> backend-deploy
