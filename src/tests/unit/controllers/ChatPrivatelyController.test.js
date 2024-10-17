const createChatPrivatelyController = require('../../../controllers/ChatPrivatelyController');

describe('ChatPrivatelyController', () => {
  let chatPrivatelyController;
  let mockPrivateMessageService;
  let mockUserService;
  let mockIo;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockPrivateMessageService = {
      getMessagesBetweenUsers: jest.fn(),
      createMessage: jest.fn(),
      getLatestMessage: jest.fn(),
      getUsersPrivateChats: jest.fn()
    };
    mockUserService = {
      findByUsername: jest.fn()
    };
    mockIo = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    chatPrivatelyController = createChatPrivatelyController(mockPrivateMessageService, mockUserService, mockIo);
    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      location: jest.fn().mockReturnThis()
    };
  });

  describe('initiatePrivateChat', () => {
    it('should return chatWall when messages exist', async () => {
      mockReq.params = { userName1: 'user1', userName2: 'user2' };
      mockUserService.findByUsername
        .mockResolvedValueOnce({ _id: 'user1Id' })
        .mockResolvedValueOnce({ _id: 'user2Id' });
      mockPrivateMessageService.getMessagesBetweenUsers.mockResolvedValue(['message1', 'message2']);

      await chatPrivatelyController.initiatePrivateChat(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ display: 'chatWall', messages: ['message1', 'message2'] });
    });

    it('should return emptyChatWall when no messages exist', async () => {
      mockReq.params = { userName1: 'user1', userName2: 'user2' };
      mockUserService.findByUsername
        .mockResolvedValueOnce({ _id: 'user1Id' })
        .mockResolvedValueOnce({ _id: 'user2Id' });
      mockPrivateMessageService.getMessagesBetweenUsers.mockResolvedValue([]);

      await chatPrivatelyController.initiatePrivateChat(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ display: 'emptyChatWall' });
    });
  });
});