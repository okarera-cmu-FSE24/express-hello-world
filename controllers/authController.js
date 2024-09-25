const AuthService = require('../services/authService');
const authService = new AuthService();

// Register user handler
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
   
    const userId = await authService.register(username, password);
    res.status(201).json({ message: 'User registered successfully', userId });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user handler
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userId = await authService.login(username, password);
    
    req.session.username = username;
    console.log(req.session.username);
    await new Promise((resolve) => req.session.save(resolve));
    
    res.status(200).json({ message: 'Login successful', userId,username:username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout user handler
exports.logout = async (req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.send('Logged out successfully');
  });
}