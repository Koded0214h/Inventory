// screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import { saveSession } from "../utils/storage";

const ACCENT = "#bd8bc2";
const PLACEHOLDER = "#9CA3AF";
const API_BASE_URL = "http://172.20.10.2:8000/api";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!canSubmit) {
      Alert.alert("Error", "Please fill email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/login/`, { email, password });
      const { access, refresh, user } = res.data;

      // Save session centrally
      await saveSession(access, refresh, user);

      // go to main
      navigation.replace("MainScreen");
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      Alert.alert("Login failed", err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={PLACEHOLDER}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            placeholderTextColor={PLACEHOLDER}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="password"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((s) => !s)}
            accessibilityLabel="Toggle password visibility"
          >
            <FontAwesome5 name={showPassword ? "eye-slash" : "eye"} size={18} color="#666" />
          </TouchableOpacity>
        </View>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: canSubmit ? ACCENT : "#F3DFF2" },
            loading && { opacity: 0.7 },
          ]}
          onPress={handleLogin}
          disabled={!canSubmit || loading}
        >
          <Text style={[styles.buttonText, { opacity: canSubmit ? 1 : 0.7 }]}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={{ color: "#666" }}>Don’t have an account?</Text>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: ACCENT, fontWeight: "600", marginLeft: 6 }}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fcfcfc",
    color: "#111",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyeButton: { paddingHorizontal: 10, paddingVertical: 6 },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
});
