import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { getAccessToken } from "../utils/storage";

const ACCENT = "#bd8bc2";
const API_BASE = "http://192.168.0.4:8000";

export default function AddItem({ navigation }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const token = await getAccessToken();
      const [catRes, unitRes] = await Promise.all([
        axios.get(`${API_BASE}/api/categories/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/units/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCategories(catRes.data);
      setUnits(unitRes.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch categories/units");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !quantity || !category || !unit) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("quantity", quantity);
      formData.append("category_id", category);
      formData.append("unit_id", unit);

      if (image) {
        formData.append("image", {
          uri: image.uri,
          type: "image/jpeg",
          name: `item_${Date.now()}.jpg`,
        } as any);
      }

      await axios.post(`${API_BASE}/api/items/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Item added successfully");
      navigation.goBack();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Item name" />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Item description"
          multiline
        />

        <Text style={styles.label}>Quantity *</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={(val) => setCategory(val)}>
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Unit *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={unit} onValueChange={(val) => setUnit(val)}>
            <Picker.Item label="Select Unit" value="" />
            {units.map((u) => (
              <Picker.Item key={u.id} label={u.symbol} value={u.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Image</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={{ color: ACCENT }}>Pick an image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Add Item</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  label: { fontWeight: "600", marginBottom: 4, marginTop: 12, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12 },
  submitButton: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
