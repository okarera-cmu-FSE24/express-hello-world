const { getModel: getMessageModel } = require("../models/Message");

function createMessageService(connection, userService) {
    const MessageModel = getMessageModel(connection);

  
    return {
      async createMessage(data) {
        const user = await userService.findById(data.user);
  
        if (!user) {
          throw new Error('User does not exist');
        }
  
        const message = new MessageModel(data);
        return await message.save();
      },
  
      async getMessagesByUser(userId) {
        return await MessageModel.find({ user: userId }).populate("user", "username");
      },
  
      async getAllMessages() {
        return await MessageModel.find().populate("user", "username");
      }
    };
  }
  
  module.exports = createMessageService;