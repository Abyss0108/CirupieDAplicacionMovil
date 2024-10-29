import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router'; // Asegúrate de importar Slot
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useContext, useState } from 'react';
import 'react-native-reanimated';
import { AuthContext, AuthProvider } from '../src/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? {}; // Verifica que no sea undefined
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Solo navega si el usuario no está autenticado
    if (loaded && !user) {
      router.replace('/login'); // Redirige si no hay usuario autenticado
    }
  }, [loaded, user]);

  if (!loaded) {
    return null; // Muestra un estado de carga mientras las fuentes están cargando
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* El Slot aquí permite que se rendericen las rutas dentro del stack */}
        <Slot /> 
      </ThemeProvider>
    </AuthProvider>
  );
}
