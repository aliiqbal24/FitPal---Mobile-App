import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { CHARACTER_IMAGES } from '../data/characters';

export default function CharacterRoster({ unlocked = 1 }) {
  const chars = Object.keys(CHARACTER_IMAGES);
  return (
    <View style={styles.container}>
      <FlatList
        data={chars}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(id) => id}
        renderItem={({ item, index }) => {
          const locked = index >= unlocked;
          return (
            <View style={[styles.card, locked && styles.locked]}
            >
              <Image source={CHARACTER_IMAGES[item]} style={styles.img} />
              {locked && (
                <Text style={styles.lockText}>Unlock at Lvl {5 * (index + 1)}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    width: 100,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locked: {
    opacity: 0.4,
  },
  img: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  lockText: {
    position: 'absolute',
    bottom: 4,
    fontSize: 12,
    color: '#333',
  },
});
