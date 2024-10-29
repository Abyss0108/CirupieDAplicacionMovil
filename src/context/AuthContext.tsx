import React, { createContext, useContext, useState, useEffect } from "react";
import { View, Text } from 'react-native';
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; 
  login: (userData: any) => void; 
  logout: () => void; 
}

// Valores predeterminados del contexto
const AuthContextDefaultValues: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(AuthContextDefaultValues);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Estado para indicar que se están cargando los datos

  // Verificar si hay un token almacenado al iniciar la app
  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          // Aquí podrías hacer una solicitud a la API para obtener los datos del usuario con el token
          // Simularemos cargando los datos de `SecureStore` directamente:
          const userData = {
            IdUser: 6,
            Nombre: "Victor",
            Correo: "20210704@uthh.edu.mx",
            Telefono: "7891198958",
            ImagenUrl: "https://res.cloudinary.com/dleyjie7k/image/upload/v1730190293/fxn2amdmsm2lc2hqjwmw.jpg",
            Token: JSON.parse(token),
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error al cargar el token del usuario:", error);
      } finally {
        setLoading(false); // Termina el estado de carga
      }
    };

    loadUserFromToken();
  }, []);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser({
      IdUser: userData.IdUser,
      Nombre: userData.Nombre,
      Correo: userData.Correo,
      Telefono: userData.Telefono,
      ImagenUrl: userData.ImagenUrl,
    });

    if (userData.Token) {
      SecureStore.setItemAsync("userToken", JSON.stringify(userData.Token)); // Guardar el token
    }
  };

  const logout = () => {
    SecureStore.deleteItemAsync("userToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
