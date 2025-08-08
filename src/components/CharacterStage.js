import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHARACTER_IMAGES } from '../data/characters';

export default function CharacterStage({ character = 'Gorilla1', accessories = {} }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FDEBEB', '#FFF']} style={styles.stage} />
      <View style={[styles.compartment, styles.hatCompartment]} />
      <View style={[styles.compartment, styles.topCompartment]} />
      <View style={[styles.compartment, styles.bottomCompartment]} />
      <Image source={CHARACTER_IMAGES[character]} style={styles.character} />
      {accessories.Hats && (
        <Text style={[styles.accessory, styles.hatItem]}>{accessories.Hats}</Text>
      )}
      {accessories.Tops && (
        <Text style={[styles.accessory, styles.topItem]}>{accessories.Tops}</Text>
      )}
      {accessories.Bottoms && (
        <Text style={[styles.accessory, styles.bottomItem]}>{accessories.Bottoms}</Text>
      )}
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
  compartment: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  hatCompartment: {
    width: 40,
    height: 20,
    top: 30,
  },
  topCompartment: {
    width: 60,
    height: 40,
    top: 90,
  },
  bottomCompartment: {
    width: 60,
    height: 40,
    top: 135,
  },
  accessory: {
    position: 'absolute',
    fontSize: 24,
  },
  hatItem: {
    top: 30,
  },
  topItem: {
    top: 90,
  },
  bottomItem: {
    top: 135,
  },
});
