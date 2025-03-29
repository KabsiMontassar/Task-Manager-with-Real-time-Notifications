module.exports = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'jsdom', // Set the test environment for frontend
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
  },
  testMatch: ['**/*.spec.ts']
};
