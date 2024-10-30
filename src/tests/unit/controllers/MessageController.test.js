const createMessageController = require('../../../controllers/MessageController');

describe('MessageController', () => {
  let messageController;
  let mockUserService;
  let mockMessageService;
  let mockObserverService;
  let mockIo;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockUserService = {
      findById: jest.fn()
    };
    mockMessageService = {
      createMessage: jest.fn(),
      getMessagesByUser: jest.fn(),
      getAllMessages: jest.fn()
    };
    mockObserverService = {
      getAll: jest.fn().mockReturnValue([])
    };
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    messageController = createMessageController(mockUserService, mockMessageService, mockObserverService, mockIo);
    mockReq = { body: {}, user: { _id: 'userId' }, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('postMessage', () => {
    it.skip('should create a message successfully', async () => {
      mockReq.body = { message: 'Test message' };
      mockUserService.findById.mockResolvedValue({ username: 'testUser' });
      mockMessageService.createMessage.mockResolvedValue({ _id: 'messageId', message: 'Test message' });

      await messageController.postMessage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Message posted successfully!',
        data: expect.any(Object)
      }));
    });

    it('should return 400 if message content is missing', async () => {
      mockReq.body = {};

      await messageController.postMessage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Message content is required' });
    });
  });
});
