const express = require("express");
const MessageController = require("../controllers/MessageController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/public", protect, (req, res) =>
  MessageController.postMessage(req, res)
);
router.get("/user/:userId?", protect, (req, res) =>
  MessageController.getMessagesByUser.bind(MessageController)
);
router.get(
  "/all",
  protect,
  MessageController.getAllMessages.bind(MessageController)
);

module.exports = router;
