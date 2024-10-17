const createStatusController = require('../../../controllers/StatusController');

describe('StatusController', () => {
  let statusController;
  let mockStatusService;
  let mockUserService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockStatusService = {
      updateStatus: jest.fn(),
      getStatusHistory: jest.fn()
    };
    mockUserService = {
      findByUsername: jest.fn()
    };
    statusController = createStatusController(mockStatusService, mockUserService);
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      location: jest.fn().mockReturnThis()
    };
  });

  describe('updateStatus', () => {
    it('should update status successfully', async () => {
      mockReq.params = { userName: 'testUser', statusCode: 'safe' };
      mockReq.body = { location: 'Test Location' };
      mockUserService.findByUsername.mockResolvedValue({ _id: 'userId' });
      mockStatusService.updateStatus.mockResolvedValue({ _id: 'statusId', statusCode: 'safe', location: 'Test Location' });

      await statusController.updateStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.location).toHaveBeenCalledWith('/users/testUser/status/statusId');
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Status updated successfully',
        data: expect.any(Object)
      }));
    });

    it('should return 404 if user not found', async () => {
      mockReq.params = { userName: 'nonexistentUser', statusCode: 'safe' };
      mockUserService.findByUsername.mockResolvedValue(null);

      await statusController.updateStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});