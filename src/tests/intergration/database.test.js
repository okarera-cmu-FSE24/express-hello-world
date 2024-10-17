
const { connectTestDatabase, disconnectTestDatabase, clearTestDatabase } = require('../testDbConnection.js');

const createUserService = require('../../services/UserService.js');
const createMessageService = require('../../services/MessageService.js');
const createPrivateMessageService = require('../../services/PrivateMessageService.js');
const createStatusService = require('../../services/StatusService.js');
const { exp } = require('prelude-ls');

let testMongoose;
let userService;
let messageService;
let privateMessageService;
let statusService;

beforeAll(async () => {
  testMongoose = await connectTestDatabase();
  userService = createUserService(testMongoose.connection);
  messageService = createMessageService(testMongoose.connection, userService);
  privateMessageService = createPrivateMessageService(testMongoose.connection, userService);
  statusService = createStatusService(testMongoose.connection, userService);
});

afterAll(async () => {
  await disconnectTestDatabase(testMongoose);
});

beforeEach(async () => {
  await clearTestDatabase(testMongoose);
});

describe('Database Tests', () => {
  let testUser1; 
  let testUser2;

  beforeEach(async () => {
    // Create a test user
    testUser1 = await userService.createUser({
      username: 'testuser1',
      password: 'password123'
    });
    testUser2 = await userService.createUser({
      username: 'testuser2',
      password: 'password456'
    });
  });

  describe('UserService', () => {
    it('should create a new user', async () => {
      const newUser = await userService.createUser({
        username: 'newuser',
        password: 'newpassword'
      });

      expect(newUser).toBeDefined();
      expect(newUser.username).toBe('newuser');
      expect(newUser.password).not.toBe('newpassword'); // Should be hashed
    });
    
    it('should find a user by username', async () => {
      const foundUser = await userService.findByUsername('testuser1');
      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe('testuser1');
    });

    it('should match password correctly', async () => {
      const isMatch = await userService.matchPassword('password123', testUser1.password);
      expect(isMatch).toBe(true);
    });

    it('should not match incorrect password', async () => {
      const isMatch = await userService.matchPassword('wrongpassword', testUser1.password);
      expect(isMatch).toBe(false);
    });

    it('should get all users', async () => {
      await userService.createUser({
        username: 'anotheruser',
        password: 'anotherpassword'
      });

      const users = await userService.getAllUsers();
      expect(users).toHaveLength(3);
      expect(users[0].username).toBe('testuser1');
      expect(users[1].username).toBe('testuser2');
      expect(users[2].username).toBe('anotheruser');
    });
  });

  describe('MessageService', () => {
    it('should create a new message', async () => {
      const newMessage = await messageService.createMessage({
        message: 'Test message',
        user: testUser1._id
      });

      expect(newMessage).toBeDefined();
      expect(newMessage.message).toBe('Test message');
      expect(newMessage.user.toString()).toBe(testUser1._id.toString());
    });

    it('should get messages by user', async () => {
      await messageService.createMessage({
        message: 'Test message 1',
        user: testUser1._id
      });
      await messageService.createMessage({
        message: 'Test message 2',
        user: testUser1._id
      });

      const messages = await messageService.getMessagesByUser(testUser1._id);
      expect(messages).toHaveLength(2);
      expect(messages[0].user._id.toString()).toBe(testUser1._id.toString());
      expect(messages[1].user._id.toString()).toBe(testUser1._id.toString());
    });

    it('should get all messages', async () => {
      const anotherUser = await userService.createUser({
        username: 'anotheruser',
        password: 'anotherpassword'
      });

      await messageService.createMessage({
        message: 'Test message 1',
        user: testUser1._id
      });
      await messageService.createMessage({
        message: 'Test message 2',
        user: anotherUser._id
      });

      const messages = await messageService.getAllMessages();
      expect(messages).toHaveLength(2);
      expect(messages[0].user.username).toBe('testuser1');
      expect(messages[1].user.username).toBe('anotheruser');
    });

    it('should not create a message for non-existent user', async () => {
      await expect(messageService.createMessage({
        message: 'Test message',
        user: '60d5ecb8b98c4e001f8e46a7' // non-existent user id
      })).rejects.toThrow('User does not exist');
    });

    describe('PrivateMessageService', () => {
      it('should create a new private message', async () => {
        const newPrivateMessage = await privateMessageService.createMessage({
          content: 'Test private message',
          sender: testUser1._id,
          receiver: testUser2._id
        });

        expect(newPrivateMessage).toBeDefined();
        expect(newPrivateMessage.content).toBe('Test private message');
        expect(newPrivateMessage.sender.toString()).toBe(testUser1._id.toString());
        expect(newPrivateMessage.receiver.toString()).toBe(testUser2._id.toString());
      });

      it('should get messages between users', async () => {
        await privateMessageService.createMessage({
          content: 'Test private message 1',
          sender: testUser1._id,
          receiver: testUser2._id
        });
        await privateMessageService.createMessage({
          content: 'Test private message 2',
          sender: testUser2._id,
          receiver: testUser1._id
        });

        const messages = await privateMessageService.getMessagesBetweenUsers(testUser1._id, testUser2._id);
        expect(messages).toHaveLength(2);
        expect(messages[0].content).toBe('Test private message 1');
        expect(messages[1].content).toBe('Test private message 2'); 
      });

      it('should get latest messages between users', async () => {
        await privateMessageService.createMessage({
          content: 'old private message 1',
          sender: testUser1._id,
          receiver: testUser2._id
        });
        await privateMessageService.createMessage({
          content: 'latest private message 2',
          sender: testUser2._id,
          receiver: testUser1._id
        });

        const latestMessages = await privateMessageService.getLatestMessage(testUser1._id, testUser2._id);
        expect(latestMessages.content).toBe('latest private message 2');
      });

      it('should get users private chats', async () => {
        await privateMessageService.createMessage({
          content: 'Message to user2',
          sender: testUser1._id,
          receiver: testUser2._id
        });
  
        const testUser3 = await userService.createUser({
          username: 'testuser3',
          password: 'password789'
        });
  
        await privateMessageService.createMessage({
          content: 'Message to user3',
          sender: testUser1._id,
          receiver: testUser3._id
        });
  
        const privateChats = await privateMessageService.getUsersPrivateChats(testUser1._id);
        expect(privateChats).toHaveLength(3);
        expect(privateChats).toContain('testuser1');
        expect(privateChats).toContain('testuser2');
        expect(privateChats).toContain('testuser3');
      });
    });

    describe('StatusService', () => {
      it('should update user status', async () => {
        const newStatus = await statusService.updateStatus(testUser1._id, 'safe', 'New York');
        
        expect(newStatus).toBeDefined();
        expect(newStatus.statusCode).toBe('safe');
        expect(newStatus.location).toBe('New York');
        expect(newStatus.user.toString()).toBe(testUser1._id.toString());
      });
  
      it('should throw error for invalid status code', async () => {
        await expect(statusService.updateStatus(testUser1._id, 'invalid_status'))
          .rejects.toThrow('Invalid status code');
      });
  
      it('should get status history for a user', async () => {
        await statusService.updateStatus(testUser1._id, 'safe', 'New York');
        await statusService.updateStatus(testUser1._id, 'in_danger', 'Chicago');
  
        const statusHistory = await statusService.getStatusHistory(testUser1._id);
        expect(statusHistory).toHaveLength(2);
        expect(statusHistory[0].statusCode).toBe('in_danger');
        expect(statusHistory[1].statusCode).toBe('safe');
      });
  
      it('should return empty array for user with no status updates', async () => {
        const statusHistory = await statusService.getStatusHistory(testUser2._id);
        expect(statusHistory).toHaveLength(0);
      });
    });
  });
});