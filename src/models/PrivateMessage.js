
const mongoose = require('mongoose');
const privateMessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = { getModel: (connection) => connection.model("PrivateMessage", privateMessageSchema) };

