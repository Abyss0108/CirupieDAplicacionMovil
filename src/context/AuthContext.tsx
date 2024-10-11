// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any; // O define una interfaz más específica para el usuario
  login: (user: any) => void; // Cambiado para recibir información del usuario
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Almacena la información del usuario

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData); // Almacena la información del usuario
    SecureStore.setItemAsync("userToken", "dummy-auth-token"); // Guarda el token si es necesario
  };

  const logout = () => {
    SecureStore.deleteItemAsync("userToken");
    setIsAuthenticated(false);
    setUser(null); // Limpia la información del usuario al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
