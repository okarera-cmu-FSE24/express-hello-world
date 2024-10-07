// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     message: { type: String, required: true },
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Message", messageSchema);


const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

class MessageService {
  async createMessage(data) {
    const message = new Message(data);
    return await message.save();
  }
  async getMessagesByUser(userId) {
    return await Message.find({ user: userId }).populate("user", "username");
  }

  async getAllMessages() {
    return await Message.find().populate("user", "username");
  }
}

module.exports = new MessageService();