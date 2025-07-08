import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHARACTER_IMAGES } from '../data/characters';

export default function CharacterStage({ character = 'GorillaM' }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FDEBEB', '#FFF']} style={styles.stage} />
      <Image source={CHARACTER_IMAGES[character]} style={styles.character} />
      <View style={[styles.layer, styles.hat]} />
      <View style={[styles.layer, styles.top]} />
      <View style={[styles.layer, styles.bottom]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  character: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  layer: {
    position: 'absolute',
    borderRadius: 4,
  },
  hat: {
    width: 40,
    height: 20,
    backgroundColor: '#FFD700',
    top: 30,
  },
  top: {
    width: 60,
    height: 40,
    backgroundColor: '#B3E5FC',
    top: 90,
  },
  bottom: {
    width: 60,
    height: 40,
    backgroundColor: '#FFCDD2',
    top: 135,
  },
});
