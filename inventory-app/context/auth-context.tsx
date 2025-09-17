// context/auth-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useProtectedRoute(user: any, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(onboarding)';
      
      if (!user && !inAuthGroup) {
        // Correcting the path to the login screen
        router.replace('/(onboarding)/login');
      } else if (user && inAuthGroup) {
        // If user is logged in and in a protected route, redirect to main
        router.replace('/(main)');
      }
    }
  }, [user, segments, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useProtectedRoute(user, isLoading);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);
  
  // Define the login function
  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });
      const userData = response.data.user;
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('accessToken', response.data.access);
      await AsyncStorage.setItem('refreshToken', response.data.refresh);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login API call failed:", error);
      throw error;
    }
  };

  // Define the register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await registerUser({ name, email, password });
      return response.data;
    } catch (error) {
      console.error("Register API call failed:", error);
      throw error;
    }
  };

  // Define the logout function
  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setUser(null);
  };
  
  // Now the value object will correctly reference the defined functions
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}