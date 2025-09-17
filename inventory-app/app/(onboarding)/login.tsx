// app/(onboarding)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.0.4:8000/api/token/', {
        username,
        password,
      });

      await AsyncStorage.setItem('access', response.data.access);
      await AsyncStorage.setItem('refresh', response.data.refresh);

      // Fetch user data
      const userResponse = await axios.get('http://192.168.0.4:8000/api/user/', {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });

      await AsyncStorage.setItem('user', JSON.stringify(userResponse.data));

      Alert.alert('Login successful');
      router.push('/(main)'); // navigate to protected page
    } catch (err: any) {
      Alert.alert('Login failed', err?.response?.data?.detail || 'Check your credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Inventory</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(onboarding)/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 30, textAlign: 'center', color: '#bd8bc2' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#bd8bc2',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: {
    marginTop: 20,
    color: '#bd8bc2',
    textAlign: 'center',
    fontSize: 14,
  },
});
