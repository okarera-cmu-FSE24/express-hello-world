// const express = require('express');
// const protect = require('../middlewares/authMiddleware');  


// module.exports = (statusController) => {
//     const router = express.Router();

    // // Route to update a user's emergency status
    // router.post('/users/:userName/status/:statusCode', protect, (req, res) => statusController.updateStatus(req, res));

    // // Route to retrieve all status breadcrumbs for a user
    // router.get('/users/:userName/statuscrumbs', protect, (req, res) => statusController.getStatusHistory(req, res));

//     return router;
// };



const express = require('express');
const protect = require('../middlewares/authMiddleware');

function statusRoutesFactory(statusController) {
const router = express.Router();
// Route to update a user's emergency status
router.post('/users/:userName/status/:statusCode', protect, (req, res) => statusController.updateStatus(req, res));

// Route to retrieve all status breadcrumbs for a user
router.get('/users/:userName/statuscrumbs', protect, (req, res) => statusController.getStatusHistory(req, res));

  return router;
}

module.exports = statusRoutesFactory;