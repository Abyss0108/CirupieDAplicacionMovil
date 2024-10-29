import React, { useState, useContext } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from '../src/context/AuthContext';
import useAuth from '../src/context/UseAuth'; 
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import md5 from 'md5';

export default function LoginScreen() {
  const { login } = useAuth(); // Usar la función login del contexto
  const router = useRouter(); // Usar router para redirigir después del login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const hashedPassword = md5(password); // Hashear la contraseña
      const response = await fetch('https://rest-api2-three.vercel.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: username,
          Pass: hashedPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        login(data); // Guardar el usuario en el contexto
        router.replace('/(tabs)'); // Redirigir al área autenticada
      } else {
        Alert.alert('Error', data.msg, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor. Por favor, inténtalo más tarde.', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/splash.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput label="Usuario" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.passwordInput}
        right={
          <TextInput.Icon
            icon={() => (
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                onPress={() => setShowPassword(!showPassword)}
              />
            )}
          />
        }
      />
      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Iniciar Sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  logo: {
    height: 150,
    width: 350,
    alignSelf: 'center',
    marginBottom: 24,
  },
  passwordInput: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
  },
});
