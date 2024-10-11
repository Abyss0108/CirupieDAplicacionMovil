import { StyleSheet, Image, Platform } from 'react-native';
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function TabTwoScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    
    login();
  };
  
  return (
    <View style={styles.container}>
       <Image 
        source={require('@/assets/images/CirupieD.png')} // Reemplaza con la ruta de tu imagen
        style={styles.Logo} 
      />
    <Text style={styles.title}>Iniciar Sesión</Text>
    <TextInput
      style={styles.input}
      placeholder="Usuario"
      value={username}
      onChangeText={setUsername}
    />
    <TextInput
      style={styles.input}
      placeholder="Contraseña"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
    <Button title="Iniciar Sesión" onPress={handleLogin} />
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white', // Cambia el color de fondo aquí
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  Logo: {
    height: 200,
    width: 220,
    bottom: 0,
    left: 0,
    position: 'relative',
  },
});

