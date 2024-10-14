import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../../src/context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import md5 from 'md5';

export default function TabTwoScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0); // Contador de intentos fallidos

  const bloquearCuenta = async () => {
    try {
      await fetch('https://rest-api2-three.vercel.app/api/users/bloquearCuenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: username, // Asumiendo que username es el correo
        }),
      });

      Alert.alert(
        'Oops...',
        'Se ha excedido el límite de intentos fallidos. Tu cuenta ha sido bloqueada. Por favor, contacta al administrador para obtener ayuda.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error al bloquear la cuenta:', error);
      Alert.alert(
        'Oops...',
        'Error al bloquear la cuenta. Por favor, inténtalo de nuevo más tarde.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogin = async () => {
    try {
      const hashedPassword = md5(password); // Asegúrate de tener `md5` importado correctamente
      const response = await fetch('https://rest-api2-three.vercel.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: username, // O el nombre de la propiedad correcto
          Pass: hashedPassword,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Inicio de sesión exitoso:', data);
        login(data.user); 
        Alert.alert('Inicio de sesion', data.msg, [{ text: 'OK' }]); // Reemplazado Swal.fire
      } else {
        console.error('Error en el inicio de sesión:', data);
        Alert.alert('Oops...', data.msg, [{ text: 'OK' }]); // Reemplazado Swal.fire
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Alert.alert(
        'Oops...',
        'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.',
        [{ text: 'OK' }]
      ); // Reemplazado Swal.fire
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/splash.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
                onPress={() => setShowPassword(!showPassword)} // Alternar visibilidad
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
