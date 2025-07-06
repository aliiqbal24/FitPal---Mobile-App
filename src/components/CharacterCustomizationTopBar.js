import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CharacterCustomizationTopBar({ level, coins, gems }) {
  return (
    <View style={styles.container}>
      <Text style={styles.level}>Lvl {level}</Text>
      <View style={styles.currency}>
        <Ionicons name="ellipse" size={20} color="#FFD700" />
        <Text style={styles.amount}>{coins}</Text>
        <Ionicons name="diamond" size={20} color="#00C8FF" />
        <Text style={styles.amount}>{gems}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  level: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amount: {
    marginRight: 12,
    fontWeight: '600',
    color: '#333',
  },
});
