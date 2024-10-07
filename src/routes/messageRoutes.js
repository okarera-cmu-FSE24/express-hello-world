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
  // messageController.getMessagesByUser.bind(messageController)
  messageController.getMessagesByUser(req, res)
);
router.get(
  "/all",
  protect,(req, res) =>
  // messageController.getAllMessages.bind(messageController)
  messageController.getAllMessages(req, res)
);

module.exports = router;
