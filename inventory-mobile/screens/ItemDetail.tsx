import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getUser } from "../utils/storage";

const ACCENT = "#bd8bc2";

export default function ItemDetail({ route, navigation }: any) {
  const { item } = route.params;
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const localUser = await getUser();
      setUser(localUser);
    };
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {user?.name || "Guest"}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Ionicons name="settings-outline" size={24} color={ACCENT} />
          </TouchableOpacity>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={20} color={ACCENT} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/300" }}
          style={styles.itemImage}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category:</Text>
          <Text style={styles.infoValue}>{item.category?.name || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Unit:</Text>
          <Text style={styles.infoValue}>{item.unit?.symbol || "-"}</Text>
        </View>

        {/* Additional buttons can go here */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Do Something</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: { fontSize: 20, fontWeight: "700", color: ACCENT },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  itemImage: { width: "100%", height: 250, borderRadius: 12, marginVertical: 16 },
  itemName: { fontSize: 24, fontWeight: "700", marginBottom: 8, color: "#333" },
  itemDescription: { fontSize: 16, marginBottom: 12, color: "#555" },
  infoRow: { flexDirection: "row", marginBottom: 6 },
  infoLabel: { fontWeight: "600", marginRight: 6 },
  infoValue: { fontWeight: "400" },
  actionButton: {
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
