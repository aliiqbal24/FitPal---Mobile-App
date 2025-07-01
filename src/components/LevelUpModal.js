import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import * as Progress from 'react-native-progress';

const AnimatedBar = Animated.createAnimatedComponent(Progress.Bar);

export default function LevelUpModal({ visible, onClose, petName }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (visible) {
      progress.setValue(0);
      setFinished(false);
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
        if (finished) {
          setFinished(true);
        }
      });
    }
  }, [visible, onClose, progress]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback
        onPress={() => {
          if (finished && onClose) onClose();
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.text}>
              {`Good Luck, ${petName || 'your pet'} is getting stronger!`}
            </Text>
            <AnimatedBar
              progress={progress}
              width={200}
              height={12}
              color="#4CAF50"
              unfilledColor="#eee"
              borderWidth={0}
            />
            {finished && <Text style={styles.tapText}>Tap to continue</Text>}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  tapText: {
    marginTop: 12,
    color: '#555',
    fontSize: 14,
  },
});
