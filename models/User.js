const bcrypt = require('bcryptjs');
const pool = require('../config/db');


//User Model or Class that represent user table in database
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Saving the user to the database with a hashed password
  async save() {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
   
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [this.username, hashedPassword]
    );
    
    return result.rows[0].id;
  }

  // Static method to find a user by username
  static async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  // Comparing password with the hashed password
  static async comparePassword(inputPassword, storedPassword) {
    return bcrypt.compare(inputPassword, storedPassword);
  }
}

module.exports = User;
