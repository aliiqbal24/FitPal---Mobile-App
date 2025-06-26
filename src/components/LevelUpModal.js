import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';
import * as Progress from 'react-native-progress';

const AnimatedBar = Animated.createAnimatedComponent(Progress.Bar);

export default function LevelUpModal({ visible, onClose }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      progress.setValue(0);
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(({ finished }) => {
        if (finished && onClose) {
          onClose();
        }
      });
    }
  }, [visible, onClose, progress]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.text}>Good Work!!!</Text>
          <AnimatedBar
            progress={progress}
            width={200}
            height={12}
            color="#4CAF50"
            unfilledColor="#eee"
            borderWidth={0}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
});
