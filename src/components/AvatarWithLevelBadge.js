import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function AvatarWithLevelBadge({ source, size = 72, level = 1 }) {
  const borderRadius = size / 2;
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius }]}>
      <Image source={source} style={{ width: size, height: size, borderRadius }} />
      {level != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{level}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
    backgroundColor: '#eee',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
