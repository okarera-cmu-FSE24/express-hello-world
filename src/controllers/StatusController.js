function createStatusController(statusService, userService) {
    return {
      async updateStatus(req, res) {
        const { userName, statusCode } = req.params;
        const { location } = req.body;  // Optional location
  
        try {
          // Find the user by username
          const user = await userService.findByUsername(userName);  
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
  
          // Update the status of the user
          const status = await statusService.updateStatus(user._id, statusCode, location);
  
          // Return the location of the newly created status breadcrumb
          res.status(201).location(`/users/${userName}/status/${status._id}`).json({
            message: 'Status updated successfully',
            data: status,
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
  
      async getStatusHistory(req, res) {
        const { userName } = req.params;
  
        try {
          // Find the user by username
          const user = await userService.findByUsername(userName);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
  
          // Get the status history (breadcrumbs) for the user
          const statuses = await statusService.getStatusHistory(user._id);
          res.status(200).json(statuses);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    };
  }
  
  module.exports = createStatusController;