const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    }
    async register(req, res) {
        const { username, password } = req.body;
        try {
            const userExists = await UserModel.findByUsername(username);
            if (userExists) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const user = await UserModel.createUser({ username, password });
            res.status(201).json({
                message: "User Registered Successfully!",
                username: user.username,
                token: this.generateToken(user._id),
                
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await UserModel.findByUsername(username);

            if (user && (await UserModel.matchPassword(password, user.password))) {
                res.json({
                    _id: user._id,
                    username: user.username,
                    token: this.generateToken(user._id),
                });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
module.exports = new UserController();
