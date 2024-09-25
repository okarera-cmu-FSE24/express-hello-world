const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

class UserService {
  async createUser(data) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const user = new UserModel(data);
    return await user.save();
  }

  async findByUsername(username) {
    return await UserModel.findOne({ username });
  }

  async findById(id) {
    return await UserModel.findById(id).select("-password");
  }

  async matchPassword(enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }
  async getAllUsers() {
    return await UserModel.find({}).select("-password");
  }
}

module.exports = new UserService();
