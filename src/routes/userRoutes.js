const express = require("express");
const UserControllerClass = require("../controllers/UserController");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const ChatPrivatelyController = require('../controllers/ChatPrivatelyController');
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

const userController = new UserControllerClass(userModel, jwt);

router.post("/", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.get("/", (req, res) => userController.getAllUsers(req, res));

router.get('/:userName/private', protect, ChatPrivatelyController.getUsersPrivateChats);

module.exports = router;