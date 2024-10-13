// Desc: message routes factory function to create message routes with message controller methods as handlers for each route.

const express = require('express');

function messageRoutesFactory(messageController, protect) {
  const router = express.Router();

  router.post("/public", protect, (req, res) => messageController.postMessage(req, res));
  router.get("/user/:userId?", protect, (req, res) => messageController.getMessagesByUser(req, res));
  router.get("/all", protect, (req, res) => messageController.getAllMessages(req, res));

  return router;
}

module.exports = messageRoutesFactory;