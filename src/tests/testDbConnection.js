const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectTestDatabase() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Use a new mongoose instance for tests
  const testMongoose = new mongoose.Mongoose();
  
  await testMongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return testMongoose;
}

async function disconnectTestDatabase(testMongoose) {
  await testMongoose.disconnect();
  await mongoServer.stop();
}

async function clearTestDatabase(testMongoose) {
  const collections = testMongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
}

module.exports = {
  connectTestDatabase,
  disconnectTestDatabase,
  clearTestDatabase,
};