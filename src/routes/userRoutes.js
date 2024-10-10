// const express = require("express");

// module.exports = (userController) => {
//   const router = express.Router();

  // router.post("/", (req, res) => userController.register(req, res));

  // router.post("/login", (req, res) => userController.login(req, res));
  
  // router.get("/", (req, res) => userController.getAllUsers(req, res));

//   return router;
// };


const express = require('express');

function userRoutesFactory(userController) {
  const router = express.Router();
  
  router.post("/", (req, res) => userController.register(req, res));

  router.post("/login", (req, res) => userController.login(req, res));
  
  router.get("/", (req, res) => userController.getAllUsers(req, res));


  return router;
}

module.exports = userRoutesFactory;