// Desc: message routes factory function to create message routes with message controller methods as handlers for each route.

const express = require('express');

function privateMessageRoutesFactory(privateMessageController, protect) {
  const router = express.Router();

  router.post('/private', protect, (req, res) => privateMessageController.sendMessage(req, res));
  router.get('/private/:userName1/:userName2', protect, (req, res) => privateMessageController.getPrivateMessages(req, res));
  router.get('/:userName/private', protect, (req, res) => privateMessageController.getUsersPrivateChats(req, res));

  return router;
}

module.exports = privateMessageRoutesFactory;