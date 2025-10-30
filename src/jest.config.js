module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(jest-fetch-mock|@testing-library)/)'
  ],
  testEnvironment: 'jsdom'
};
