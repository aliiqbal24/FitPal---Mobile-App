import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { key: 'Outfits', icon: 'shirt' },
  { key: 'Evolutions', icon: 'flash' },
  { key: 'Home', icon: 'home' },
  { key: 'Shop', icon: 'cart' },
];

export default function CustomizationBottomTabs({ tab, onTabChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((t) => (
        <BounceIcon
          key={t.key}
          icon={t.icon}
          active={tab === t.key}
          onPress={() => onTabChange && onTabChange(t.key)}
        />
      ))}
    </View>
  );
}

function BounceIcon({ icon, active, onPress }) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress && onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.tab}>
      <Animated.View style={{ transform: [{ scale: active ? scale : 1 }] }}>
        <Ionicons name={icon} size={28} color={active ? '#4CAF50' : '#555'} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
