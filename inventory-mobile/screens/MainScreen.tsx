// screens/MainScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { getAccessToken, getUser, clearSession } from "../utils/storage";

const ACCENT = "#bd8bc2";

export default function MainScreen({ navigation }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const API_BASE = "http://172.20.10.2:8000";

  const fetchUser = async (token: string) => {
    const res = await axios.get(`${API_BASE}/api/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  const fetchItems = async (token: string) => {
    const res = await axios.get(`${API_BASE}/api/items/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(res.data.results || []); // DRF pagination: use .results
  };

  const loadData = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        navigation.replace("Login");
        return;
      }

      const localUser = await getUser();
      if (localUser) setUser(localUser);

      await fetchUser(token);
      await fetchItems(token);
    } catch (err: any) {
      console.error("Load data error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        await clearSession();
        navigation.replace("Login");
      } else {
        Alert.alert("Error", "Could not load data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    await clearSession();
    navigation.replace("Login");
  };

  const handleProfilePress = () => {
    Alert.alert("Account", user?.email ?? "", [
      { text: "Logout", style: "destructive", onPress: handleLogout },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Local quantities state
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Update quantity on backend
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      // Optimistically update UI
      setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));

      await axios.patch(
        `${API_BASE}/api/items/${itemId}/`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err: any) {
      console.error("Quantity update failed:", err.response?.data || err.message);
      Alert.alert("Error", "Could not update quantity");
    }
  };

  const increaseQuantity = (itemId: string) => {
    const current = quantities[itemId] ?? items.find((i) => i.id === itemId)?.quantity ?? 0;
    const newQuantity = Number(current) + 1;
    updateQuantity(itemId, newQuantity);
  };

  const decreaseQuantity = (itemId: string) => {
    const current = quantities[itemId] ?? items.find((i) => i.id === itemId)?.quantity ?? 0;
    const newQuantity = Math.max(Number(current) - 1, 0);
    updateQuantity(itemId, newQuantity);
  };

  const renderItem = ({ item }: any) => {
    const imageUrl = item.image
      ? item.image.startsWith("http")
        ? item.image
        : `${API_BASE}${item.image}`
      : "https://via.placeholder.com/150";
  
    const quantity = quantities[item.id] ?? Number(item.quantity);
  
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => navigation.navigate("ItemDetail", { item, user })}
      >
        <View style={styles.card}>
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQuantity(item.id)}>
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQuantity(item.id)}>
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 60],
    extrapolate: "clamp",
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [26, 16],
    extrapolate: "clamp",
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Text style={[styles.greeting, { fontSize: titleSize }]}>
            Hi {user?.name || "Guest"}
        </Animated.Text>

        <View style={styles.rightIcons}>
            {/* Add item button */}
            <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("AddItem" as never)}
            >
            <Ionicons name="add-circle-outline" size={24} color={ACCENT} />
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Settings" as never)}
            >
            <Ionicons name="settings-outline" size={22} color={ACCENT} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileCircle} onPress={handleProfilePress}>
            <Ionicons name="person" size={18} color={ACCENT} />
            </TouchableOpacity>
        </View>
      </Animated.View>


      {/* INVENTORY GRID */}
      <Animated.FlatList
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 24 }}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ACCENT]} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: { fontWeight: "700", color: ACCENT },
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

  // CARD
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 5,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: { width: "100%", height: 120, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
  cardWrapper: { flex: 1, marginHorizontal: 5, marginVertical: 8 },

  // Quantity Selector
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ACCENT,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qtyButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  qtyText: { fontSize: 20, fontWeight: "700", color: ACCENT },
  qtyNumber: { fontSize: 18, fontWeight: "600", color: "#fff" },
});
