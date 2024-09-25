const pool = require('../config/db');

// Message Model or class that represents messages table in database
class Message {
  constructor(username, text) {
    this.username = username;
    this.text = text;
  }

  // Saving the message to the database
  async save() {
    const result = await pool.query(
      'INSERT INTO messages (username, text, created_at) VALUES ($1, $2, NOW()) RETURNING id',
      [this.username, this.text]
    );
    return result.rows[0].id;
  }

  // Static method to retrieve all messages
  static async getAll() {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at ASC');
    return result.rows;
  }
}

module.exports = Message;
