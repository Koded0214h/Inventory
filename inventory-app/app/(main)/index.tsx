// app/(main)/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image, Animated } from "react-native";
import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import api from "@/constants/api";
import ItemCard from "@/components/ItemCard";

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150";

const MainScreen = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/items/");
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError("Failed to load inventory. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const headerFontSize = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [24, 16],
    extrapolate: "clamp",
  });

  const headerMarginTop = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [15, 5],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with user info, settings, and profile */}
      <Animated.View style={[styles.header, { paddingVertical: headerMarginTop }]}>
        <Animated.Text style={[styles.headerTitle, { fontSize: headerFontSize }]}>
          Hi, {user?.name || user?.email.split("@")[0]}
        </Animated.Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => console.log("Settings pressed")}>
            <Ionicons name="settings-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileContainer}>
            <Image source={{ uri: DEFAULT_PROFILE_IMAGE }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main content section */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#bd8bc2" style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Animated.FlatList
          data={items}
          renderItem={({ item }) => <ItemCard item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    marginLeft: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#bd8bc2",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 50,
  },
});

export default MainScreen;
