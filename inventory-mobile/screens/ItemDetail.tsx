// screens/ItemDetail.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAccessToken } from "../utils/storage";
import axios from "axios";

const ACCENT = "#bd8bc2";
const API_BASE = "http://192.168.0.4:8000";

export default function ItemDetail({ route, navigation }: any) {
  const { item, user } = route.params; // get logged-in user
  const [quantity, setQuantity] = useState(Number(item.quantity));

  const increaseQuantity = async () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    await updateBackend(newQty);
  };

  const decreaseQuantity = async () => {
    const newQty = Math.max(quantity - 1, 0);
    setQuantity(newQty);
    await updateBackend(newQty);
  };

  const updateBackend = async (newQty: number) => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      await axios.patch(
        `${API_BASE}/api/items/${item.id}/`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: any) {
      console.error("Quantity update failed:", err.response?.data || err.message);
      Alert.alert("Error", "Could not update quantity");
    }
  };

  const imageUrl = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `${API_BASE}${item.image}`
    : "https://via.placeholder.com/300";

  return (
    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.greeting}>Hi {user?.name || "Guest"}</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Settings" as never)}
          >
            <Ionicons name="settings-outline" size={22} color={ACCENT} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCircle} onPress={() => Alert.alert("Profile")}>
            <Ionicons name="person" size={18} color={ACCENT} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ITEM IMAGE */}
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />

        {/* ITEM DETAILS */}
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{item.category?.name || "-"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Unit:</Text>
          <Text style={styles.infoValue}>{item.quantity} {item.unit?.symbol || "-"}</Text>
        </View>

        {/* ADD TO CART BUTTON */}
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Added to cart")}>
          <View style={styles.buttonContent}>
            <Ionicons name="cart-outline" size={22} color="#fff" />
            <Text style={styles.actionText}>Add To Cart</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: { fontSize: 18, fontWeight: "700", color: ACCENT },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  iconButton: { paddingHorizontal: 8, paddingVertical: 6, marginRight: 6 },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  content: { padding: 16 },

  itemImage: { width: "100%", height: 250, borderRadius: 12, marginBottom: 16 },
  itemName: { fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 8 },
  itemDescription: { fontSize: 16, color: "#555", marginBottom: 16 },

  infoRow: { flexDirection: "row", marginBottom: 8 },
  infoLabel: { fontWeight: "600", width: 90 },
  infoValue: { fontWeight: "400", color: "#333" },

  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ACCENT,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  qtyButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  qtyText: { fontSize: 22, fontWeight: "700", color: ACCENT },
  qtyNumber: { fontSize: 20, fontWeight: "600", color: "#fff" },

  actionButton: {
    marginTop: 24,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
