import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const DATA = {
  Hats: ['🎩', '🎓', '👑', '🧢'],
  Tops: ['👕', '🥋', '🎽', '🧥'],
  Bottoms: ['👖', '👗', '🩳', '🩱'],
};

export default function OutfitCloset({ tab, onTabChange }) {
  const items = DATA[tab];
  const [equipped, setEquipped] = useState({});

  const handleEquip = (item) => {
    setEquipped({ ...equipped, [tab]: item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {Object.keys(DATA).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onTabChange && onTabChange(key)}
            style={[styles.tab, tab === key && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={items}
        numColumns={4}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEquip(item)}
            style={[styles.item, equipped[tab] === item && styles.itemActive]}
          >
            <Text style={styles.emoji}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: {
    borderColor: '#4CAF50',
  },
  tabText: {
    color: '#888',
  },
  tabTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  item: {
    width: '25%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  itemActive: {
    backgroundColor: '#B3E5FC',
  },
  emoji: {
    fontSize: 24,
  },
});
