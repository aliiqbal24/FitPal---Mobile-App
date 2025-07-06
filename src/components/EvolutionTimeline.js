import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export default function EvolutionTimeline({ currentLevel }) {
  const stages = [1, 5, 10];
  const progress = Math.min(currentLevel, 10) / 10;
  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={null}
        color="#4CAF50"
        unfilledColor="#eee"
        borderWidth={0}
        style={styles.bar}
      />
      <View style={styles.stages}>
        {stages.map((lvl) => (
          <View key={lvl} style={styles.stage}>
            <View
              style={[styles.circle, currentLevel >= lvl ? styles.unlocked : styles.locked]}
            />
            <Text style={styles.label}>Lvl {lvl}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bar: {
    marginBottom: 8,
  },
  stages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stage: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  unlocked: {
    backgroundColor: '#4CAF50',
  },
  locked: {
    backgroundColor: '#ccc',
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
});
