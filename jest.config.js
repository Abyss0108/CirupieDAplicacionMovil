module.exports = {
    preset: 'react-native',
    setupFiles: ['<rootDir>/jestSetup.js'],
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-gesture-handler|react-native-vector-icons)/)',
    ],
    moduleNameMapper: {
      '^react-native-vector-icons/(.*)$': '<rootDir>/__mocks__/react-native-vector-icons.js',
    },
    transform: {},
  };
  