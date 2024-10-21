
function createStatusService(connection) {
  const { getModel: getStatusModel } = require("../models/Status");
  const StatusModel = getStatusModel(connection);

  const validStatuses = ["safe", "in_danger", "requesting_help", "helping_others", "evacuating"];

  return {
    async updateStatus(userId, statusCode, location = null) {
      if (!validStatuses.includes(statusCode)) {
        throw new Error("Invalid status code. Valid statuses are: safe, in_danger, requesting_help, helping_others, evacuating.");
      }

      return await StatusModel.create({ user: userId, statusCode, location });
    },

    async getStatusHistory(userId) {
      return await StatusModel.find({ user: userId }).sort({ createdAt: -1 });
    }
  };
}

module.exports = createStatusService;