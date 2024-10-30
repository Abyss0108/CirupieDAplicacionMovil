jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock de expo-secure-store para evitar errores de importación
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));
