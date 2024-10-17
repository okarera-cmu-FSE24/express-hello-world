
const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    statusCode: { type: String, required: true }, // Status: e.g., "safe", "in_danger", "requesting_help"
    location: { type: String, default: null },    
  },
  { timestamps: true }
);


module.exports = { getModel: (connection) => connection.model("Status", statusSchema) };
