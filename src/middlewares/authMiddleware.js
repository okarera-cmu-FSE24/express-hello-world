const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            console.log("h0");
            token = req.headers.authorization.split(' ')[1];
            console.log("h1");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("h2");
            console.log("decoded print"+decoded.id);
            req.user = await UserService.findById(decoded.id);
            console.log("h3");

            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log("h4");
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;
