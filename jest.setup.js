export default {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.js?(x)', '**/test/?(*.)+(spec|test).js?(x)'],
    setupFilesAfterEnv: ['./test/jest.setup.js'],
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    // Account for ES modules
    transformIgnorePatterns: ['node_modules/(?!(your-es-module-dependency)/)'],
  };