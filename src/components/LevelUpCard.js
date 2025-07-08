import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';

export default function LevelUpCard({ visible, onClose, petName }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.8);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          delay: 1200,
          useNativeDriver: true,
        }).start(() => onClose && onClose());
      });
    }
  }, [visible, scale, opacity, onClose]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay} pointerEvents="none">
        <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
          <Text style={styles.text}>{`${petName || 'Your pet'} leveled up, Good Work!!`}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
});
