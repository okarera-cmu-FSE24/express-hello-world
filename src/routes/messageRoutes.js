// const express = require("express");
// const protect = require("../middlewares/authMiddleware");

// module.exports = (messageController) => {
//   const router = express.Router();

  // router.post("/public", protect, (req, res) => messageController.postMessage(req, res));

  // router.get("/user/:userId?", protect, (req, res) => messageController.getMessagesByUser(req, res));
  
  // router.get("/all", protect, (req, res) => messageController.getAllMessages(req, res));

//   return router;
// };

const express = require('express');
const protect = require('../middlewares/authMiddleware');

function messageRoutesFactory(messageController) {
  const router = express.Router();

  router.post("/public", protect, (req, res) => messageController.postMessage(req, res));

  router.get("/user/:userId?", protect, (req, res) => messageController.getMessagesByUser(req, res));
  
  router.get("/all", protect, (req, res) => messageController.getAllMessages(req, res));

  return router;
}

module.exports = messageRoutesFactory;