import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import * as Progress from 'react-native-progress';

const AnimatedBar = Animated.createAnimatedComponent(Progress.Bar);

export default function LevelUpModal({ visible, onClose, petName, sprite }) {
  const progress = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState('progress'); // progress -> flash -> done

  useEffect(() => {
    if (visible) {
      progress.setValue(0);
      flash.setValue(0);
      setPhase('progress');
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
      ]).start(() => {
        setPhase('flash');
        Animated.sequence([
          Animated.timing(flash, { toValue: 1, duration: 150, useNativeDriver: false }),
          Animated.timing(flash, { toValue: 0, duration: 150, useNativeDriver: false }),
        ]).start(() => setPhase('done'));
      });
    }
  }, [visible, progress, flash]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={() => phase === 'done' && onClose && onClose()}>
        <View style={styles.overlay}>
          <View style={styles.box}>
            {phase !== 'done' && (
              <>
                <Text style={styles.text}>{`${petName || 'Your pet'} is getting stronger!`}</Text>
                <AnimatedBar
                  progress={progress}
                  width={200}
                  height={12}
                  color="#4CAF50"
                  unfilledColor="#eee"
                  borderWidth={0}
                />
              </>
            )}
            {phase === 'done' && (
              <>
                <Image source={sprite} style={styles.sprite} />
                <Text style={styles.tapText}>Tap to continue</Text>
              </>
            )}
            {phase === 'flash' && (
              <Animated.View style={[styles.flash, { opacity: flash }]} />
            )}
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
  sprite: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
});
