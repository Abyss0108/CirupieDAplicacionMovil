module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jestSetup.js'], // Asegura que se cargue jestSetup.js
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-gesture-handler|react-native-vector-icons)/)', // Mantén los módulos necesarios sin ignorar
  ],
  moduleNameMapper: {
    '^react-native-vector-icons/(.*)$': '<rootDir>/__mocks__/react-native-vector-icons.js', // Mock de vector-icons
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest', // Asegúrate de que Babel maneje JS y TS
  },
  // Otras configuraciones adicionales si es necesario
};
