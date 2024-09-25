const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

// Retrieving all messages route
router.get('/messages/', chatController.getAllMessages);

// Send a message route
router.post('/messages/', chatController.sendMessage);

module.exports = router;
