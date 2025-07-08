import React, { useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { CHARACTER_OPTIONS } from '../data/characters';

const ITEM_SIZE = 80;
const RADIUS = 130;

export default function CircularCharacterGallery({ onSelect }) {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(-Math.PI * 2, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.start = angle.value;
    },
    onActive: (event, ctx) => {
      angle.value = ctx.start + event.translationX / RADIUS;
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={styles.wrap}>
        {CHARACTER_OPTIONS.map((char, index) => (
          <AnimatedCharacter
            key={char.id}
            char={char}
            index={index}
            total={CHARACTER_OPTIONS.length}
            angle={angle}
            onSelect={onSelect}
          />
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
}

function AnimatedCharacter({ char, index, total, angle, onSelect }) {
  const animStyle = useAnimatedStyle(() => {
    const step = (2 * Math.PI) / total;
    const a = angle.value + step * index;
    const x = Math.cos(a) * RADIUS;
    const y = Math.sin(a) * 20;
    const scale = interpolate(y, [-20, 20], [1.1, 0.9]);

    // zIndex must be an integer to prevent precision errors in native bridge
    const zIndex = Math.round(interpolate(y, [-20, 20], [2, 0]));
    const opacity = interpolate(y, [-20, 20], [1, 0.5]);

    return {
      position: 'absolute',
      transform: [{ translateX: x }, { translateY: y }, { scale }],
      zIndex,
      opacity,
    };
  });

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity onPress={() => onSelect && onSelect(char.id)}>
        <Image source={char.image} style={styles.image} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: RADIUS * 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    resizeMode: 'contain',
  },
});
