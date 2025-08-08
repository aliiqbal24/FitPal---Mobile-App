import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { CHARACTER_IMAGES } from '../data/characters';

export default function PokemonStatsCard() {
  // Static mock data
  const petName = 'Kidling';
  const level = 7;
  const exp = 10;
  const expForNext = 45;
  const favouriteExercise = 'Bench Press';
  const age = '4 days';
  const weightLifted = '2450 kg';

  const progress = exp / expForNext;

  return (
    <View style={styles.card}>
      <View style={styles.leftColumn}>
        <Text style={styles.name}>{`${petName} - Lv. ${level}`}</Text>
        <View style={styles.spriteBox}>
          <Image source={CHARACTER_IMAGES.Gorilla1} style={styles.sprite} resizeMode="contain" />
        </View>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.expLabel}>{`${exp} / ${expForNext} XP`}</Text>
        <Progress.Bar
          progress={progress}
          width={null}
          height={8}
          color="#E51A4C"
          unfilledColor="#e0e0e0"
          borderWidth={0}
          style={styles.expBar}
        />
        <View style={styles.statRow}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statText}>Favourite Exercise: {favouriteExercise}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statIcon}>⏰</Text>
          <Text style={styles.statText}>Age: {age}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statIcon}>🏋️</Text>
          <Text style={styles.statText}>Weight Lifted: {weightLifted}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftColumn: {
    flex: 0.45,
    marginRight: 12,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  spriteBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccd',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprite: {
    width: 80,
    height: 80,
  },
  rightColumn: {
    flex: 0.55,
  },
  expLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  expBar: {
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statIcon: {
    marginRight: 6,
  },
  statText: {
    color: '#222',
    fontSize: 14,
    flexShrink: 1,
  },
});
