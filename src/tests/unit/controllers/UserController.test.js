const createUserController = require('../../../controllers/UserController');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('UserController', () => {
  let userController;
  let mockUserService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockUserService = {
      findByUsername: jest.fn(),
      createUser: jest.fn(),
      matchPassword: jest.fn(),
      getAllUsers: jest.fn()
    };
    userController = createUserController(mockUserService);
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    process.env.JWT_SECRET = 'testsecret';
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = { username: 'newUser', password: 'password123' };
      mockUserService.findByUsername.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({ _id: 'userId', username: 'newUser' });
      jwt.sign.mockReturnValue('testToken');

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User Registered Successfully!',
        username: 'newUser',
        token: 'testToken'
      }));
    });

    it('should return 400 if username already exists', async () => {
      mockReq.body = { username: 'existingUser', password: 'password123' };
      mockUserService.findByUsername.mockResolvedValue({ username: 'existingUser' });

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Username already exists' });
    });
  });

});