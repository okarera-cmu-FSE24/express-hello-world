<<<<<<< HEAD
const StatusModel = require('../models/Status');

class StatusService {
  // Update the status of a user in the emergency network
  async updateStatus(userId, statusCode, location = null) {
    const validStatuses = ["safe", "in_danger", "requesting_help", "helping_others", "evacuating"];
    
    if (!validStatuses.includes(statusCode)) {
      throw new Error("Invalid status code. Valid statuses are: safe, in_danger, requesting_help, helping_others, evacuating.");
    }

    // Save the new status in the database
    return await StatusModel.create({ user: userId, statusCode, location });
  }

  // Retrieve all status breadcrumbs for a user
  async getStatusHistory(userId) {
    return await StatusModel.find({ user: userId }).sort({ createdAt: -1 });
  }
}

module.exports = new StatusService();
=======

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
>>>>>>> backend-deploy
