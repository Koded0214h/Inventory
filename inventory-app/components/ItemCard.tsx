import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface ItemCardProps {
  item: {
    id: number;
    name: string;
    quantity: number;
    images: { image: string }[];
  };
  onPress?: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        style={styles.image}
        source={{ uri: item.images[0]?.image || "https://via.placeholder.com/200" }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}> - {item.quantity} items</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginTop: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantityContainer: {
    marginTop: 5,
  },
  quantityText: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});

export default ItemCard;
