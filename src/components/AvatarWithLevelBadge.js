import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function AvatarWithLevelBadge({
  source,
  size = 72,
  level = 1,
  rounded = true,
}) {
  const borderRadius = rounded ? size / 2 : 0;
  return (
    <View
      style={[styles.container, { width: size, height: size, borderRadius }]}
    >
      <Image
        source={source}
        style={{ width: size, height: size, borderRadius }}
        resizeMode="contain"
      />
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
    backgroundColor: 'transparent',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
