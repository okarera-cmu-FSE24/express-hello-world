const User = require('../models/User');

// Class that will handle the authentication
class AuthService {
  // Registering a new user
  async register(username, password) {
    const existingUser = await User.findByUsername(username);
    console.log(username,password);
    
    if (existingUser) {
      throw new Error('Username already exists');
    }

    console.log("no user found");
    
    const newUser = new User(username, password);
    
    const userId = await newUser.save();
    
    return userId;
  }

  // Log in a user
  async login(username, password) {
    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return user.id;
  }

  
}

module.exports = AuthService;



