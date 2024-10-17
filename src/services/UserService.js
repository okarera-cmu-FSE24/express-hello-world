const bcrypt = require("bcryptjs");
const { getModel: getUserModel } = require("../models/User");

function createUserService(connection) {
    const UserModel = getUserModel(connection);

  return {
    async createUser(data) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      const user = new UserModel(data);
      return await user.save();
    },

    async findByUsername(username) {
      return await UserModel.findOne({ username });
    },

    async findById(id) {
        // console.log("id in findid  " + id);
      return await UserModel.findById(id).select("-password");
    },

    async matchPassword(enteredPassword, storedPassword) {
      return await bcrypt.compare(enteredPassword, storedPassword);
    },

    async getAllUsers() {
      return await UserModel.find({}).select("-password");
    }
  };
}

module.exports = createUserService;