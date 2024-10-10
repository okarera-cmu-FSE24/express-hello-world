module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  verbose: true,
  coveragePathIgnorePatterns: ['/node_modules/']
};