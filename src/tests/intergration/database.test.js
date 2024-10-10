// const { connectTestDatabase, disconnectTestDatabase, clearTestDatabase } = require('../testDbConnection.js');

// const UserService = require('../../services/UserService.js');
// const MessageService = require('../../services/MessageService.js');

// const { getUserModel } = require('../../models/User');
// const { getMessageModel } = require('../../models/Message');

// let connection;
// let UserModel;
// let MessageModel;

// beforeAll(async () => {
//   connection = await connectTestDatabase();
//   getUserModel = getUserModel(connection);
//   getMessageModel = getMessageModel(connection);
// });

// afterAll(async () => {
//   await disconnectTestDatabase();
// });

// beforeEach(async () => {
//   await clearTestDatabase();
// });

// describe('Database Tests', () => {
//   let testUser;

//   beforeEach(async () => {
//     // Create a test user
//     testUser = await UserService.createUser({
//       username: 'testuser',
//       password: 'password123'
//     });
//   });

//   describe('UserService', () => {
//     it('should create a new user', async () => {
//       const newUser = await UserService.createUser({
//         username: 'newuser',
//         password: 'newpassword'
//       });

//       expect(newUser).toBeDefined();
//       expect(newUser.username).toBe('newuser');
//       expect(newUser.password).not.toBe('newpassword'); // Should be hashed
//     });

//     it('should find a user by username', async () => {
//       const foundUser = await UserService.findByUsername('testuser');
//       expect(foundUser).toBeDefined();
//       expect(foundUser.username).toBe('testuser');
//     });

//     it('should match password correctly', async () => {
//       const isMatch = await UserService.matchPassword('password123', testUser.password);
//       expect(isMatch).toBe(true);
//     });
//   });

//   describe('MessageService', () => {
//     it('should create a new message', async () => {
//       const newMessage = await MessageService.createMessage({
//         message: 'Test message',
//         user: testUser._id
//       });

//       expect(newMessage).toBeDefined();
//       expect(newMessage.message).toBe('Test message');
//       expect(newMessage.user.toString()).toBe(testUser._id.toString());
//     });

//     it('should get messages by user', async () => {
//       await MessageService.createMessage({
//         message: 'Test message 1',
//         user: testUser._id
//       });
//       await MessageService.createMessage({
//         message: 'Test message 2',
//         user: testUser._id
//       });

//       const messages = await MessageService.getMessagesByUser(testUser._id);
//       expect(messages).toHaveLength(2);
//       expect(messages[0].user._id.toString()).toBe(testUser._id.toString());
//     });

//     it('should get all messages', async () => {
//       await MessageService.createMessage({
//         message: 'Test message 1',
//         user: testUser._id
//       });
//       await MessageService.createMessage({
//         message: 'Test message 2',
//         user: testUser._id
//       });

//       const messages = await MessageService.getAllMessages();
//       expect(messages).toHaveLength(2);
//       expect(messages[0].user.username).toBe('testuser');
//     });
//   });
// });



const { connectTestDatabase, disconnectTestDatabase, clearTestDatabase } = require('../testDbConnection.js');

const createUserService = require('../../services/UserService.js');
const createMessageService = require('../../services/MessageService.js');

let testMongoose;
let userService;
let messageService;

beforeAll(async () => {
  testMongoose = await connectTestDatabase();
  userService = createUserService(testMongoose.connection);
  messageService = createMessageService(testMongoose.connection, userService);
});

afterAll(async () => {
  await disconnectTestDatabase(testMongoose);
});

beforeEach(async () => {
  await clearTestDatabase(testMongoose);
});

describe('Database Tests', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = await userService.createUser({
      username: 'testuser',
      password: 'password123'
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
      const foundUser = await userService.findByUsername('testuser');
      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe('testuser');
    });

    it('should match password correctly', async () => {
      const isMatch = await userService.matchPassword('password123', testUser.password);
      expect(isMatch).toBe(true);
    });

    it('should not match incorrect password', async () => {
      const isMatch = await userService.matchPassword('wrongpassword', testUser.password);
      expect(isMatch).toBe(false);
    });

    it('should get all users', async () => {
      await userService.createUser({
        username: 'anotheruser',
        password: 'anotherpassword'
      });

      const users = await userService.getAllUsers();
      expect(users).toHaveLength(2);
      expect(users[0].username).toBe('testuser');
      expect(users[1].username).toBe('anotheruser');
    });
  });

  describe('MessageService', () => {
    it('should create a new message', async () => {
      const newMessage = await messageService.createMessage({
        message: 'Test message',
        user: testUser._id
      });

      expect(newMessage).toBeDefined();
      expect(newMessage.message).toBe('Test message');
      expect(newMessage.user.toString()).toBe(testUser._id.toString());
    });

    it('should get messages by user', async () => {
      await messageService.createMessage({
        message: 'Test message 1',
        user: testUser._id
      });
      await messageService.createMessage({
        message: 'Test message 2',
        user: testUser._id
      });

      const messages = await messageService.getMessagesByUser(testUser._id);
      expect(messages).toHaveLength(2);
      expect(messages[0].user._id.toString()).toBe(testUser._id.toString());
      expect(messages[1].user._id.toString()).toBe(testUser._id.toString());
    });

    it('should get all messages', async () => {
      const anotherUser = await userService.createUser({
        username: 'anotheruser',
        password: 'anotherpassword'
      });

      await messageService.createMessage({
        message: 'Test message 1',
        user: testUser._id
      });
      await messageService.createMessage({
        message: 'Test message 2',
        user: anotherUser._id
      });

      const messages = await messageService.getAllMessages();
      expect(messages).toHaveLength(2);
      expect(messages[0].user.username).toBe('testuser');
      expect(messages[1].user.username).toBe('anotheruser');
    });

    it('should not create a message for non-existent user', async () => {
      await expect(messageService.createMessage({
        message: 'Test message',
        user: '60d5ecb8b98c4e001f8e46a7' // non-existent user id
      })).rejects.toThrow('User does not exist');
    });
  });
});