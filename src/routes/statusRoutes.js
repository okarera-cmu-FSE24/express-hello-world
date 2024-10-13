// Desc: status routes factory function to create status routes with status controller methods as handlers for each route.

const express = require('express');

function statusRoutesFactory(statusController, protect) {
const router = express.Router();
// Route to update a user's emergency status
router.post('/users/:userName/status/:statusCode', protect, (req, res) => statusController.updateStatus(req, res));

// Route to retrieve all status breadcrumbs for a user
router.get('/users/:userName/statuscrumbs', protect, (req, res) => statusController.getStatusHistory(req, res));

  return router;
}

module.exports = statusRoutesFactory;