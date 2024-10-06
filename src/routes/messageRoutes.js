const express = require("express");

const MessageModel = require("../models/Message");
const UserModel = require("../models/User");
const Observers = require('../services/observerService');
const MessageControllerClass = require('../controllers/MessageController');

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

const messageController = new MessageControllerClass(MessageModel, UserModel, Observers);

// Routes
router.post("/public", protect, (req, res) =>
  messageController.postMessage(req, res)
);
router.get("/user/:userId?", protect, (req, res) =>
  messageController.getMessagesByUser.bind(messageController)
);
router.get(
  "/all",
  protect,
  messageController.getAllMessages.bind(messageController)
);

module.exports = router;
