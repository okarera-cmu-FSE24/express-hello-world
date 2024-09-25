
const express = require('express');
const MessageController = require('../controllers/MessageController');
const protect = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/public',protect, (req, res) => MessageController.postMessage(req, res));



module.exports = router;
