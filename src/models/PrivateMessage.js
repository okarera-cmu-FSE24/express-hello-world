// models/PrivateMessage.js
const mongoose = require("mongoose");

const privateMessageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const PrivateMessageModel = mongoose.model("PrivateMessage", privateMessageSchema);

module.exports = PrivateMessageModel;
