import React, { useContext } from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../../src/context/AuthContext'; // Asegúrate de importar correctamente tu contexto de autenticación
import useAuth from '../../src/context/UseAuth'; // Asegúrate de importar correctamente tu contexto de autenticación
import { useRouter } from 'expo-router';

const UserProfileScreen = () => {
  const { user, logout } = useAuth(); // Traemos los datos del usuario autenticado y la función logout
  const router = useRouter();

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    router.replace('/login'); // Redirige al login después de cerrar sesión
  };

  // Si `user` es null, muestra un estado de carga o un mensaje
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando datos del perfil...</Text>
      </View>
    );
  }

  // Muestra los datos del usuario solo si existe
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        {user.ImagenUrl ? (
          <Image
            source={{ uri: user.ImagenUrl }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require('@/assets/images/descarga.jpg')} // Imagen por defecto si no hay imagen del usuario
            style={styles.profileImage}
          />
        )}
        <Text style={styles.userName}>{user.Nombre}</Text>
        <Text style={styles.userInfo}>
          <Text style={styles.label}>Correo: </Text>
          {user.Correo}
        </Text>
        <Text style={styles.userInfo}>
          <Text style={styles.label}>Teléfono: </Text>
          {user.Telefono}
        </Text>
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Para hacer la imagen circular
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 24,
    borderColor: 'red',
    borderWidth: 1,
    color: 'red',
  },
});

export default UserProfileScreen;
