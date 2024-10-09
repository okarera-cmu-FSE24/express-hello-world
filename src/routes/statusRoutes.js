const express = require('express');
const StatusController = require('../controllers/StatusController');
const protect = require('../middlewares/authMiddleware');  // Assuming JWT auth middleware is used

const router = express.Router();

// Route to update a user's emergency status
router.post('/users/:userName/status/:statusCode', protect, StatusController.updateStatus);

// Route to retrieve all status breadcrumbs for a user
router.get('/users/:userName/statuscrumbs', protect, StatusController.getStatusHistory);

module.exports = router;
