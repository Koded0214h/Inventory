import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function DummyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dummy Page</Text>
      <Text style={styles.text}>Splash navigated here successfully.</Text>
      <Pressable style={styles.button} onPress={() => { navigation.replace("Login") }}>
        <Text style={styles.buttonText}>Okay</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 6, color: "#222" },
  text: { color: "#444", marginBottom: 16 },
  button: { backgroundColor: "#bd8bc2", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
