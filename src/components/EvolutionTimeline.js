import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export default function EvolutionTimeline({ currentLevel }) {
  const stages = [1, 5, 10];
  const maxLevel = 10;
  const progress = Math.min(currentLevel, maxLevel) / maxLevel;
  const [barWidth, setBarWidth] = useState(0);

  return (
    <View style={styles.container}>
      <View
        style={styles.barWrapper}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        <Progress.Bar
          progress={progress}
          width={null}
          color="#4CAF50"
          unfilledColor="#eee"
          borderWidth={0}
          style={styles.bar}
        />
        {barWidth > 0 &&
          stages.map((lvl) => {
            const left = (lvl / maxLevel) * barWidth - 12;
            return (
              <View key={lvl} style={[styles.nodeContainer, { left }]}>
                <View
                  style={[styles.circle, currentLevel >= lvl ? styles.unlocked : styles.locked]}
                />
                <Text style={styles.label}>Lvl {lvl}</Text>
              </View>
            );
          })}
        {barWidth > 0 && (
          <View
            style={[styles.userMarker, { left: progress * barWidth - 6 }]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  barWrapper: {
    position: 'relative',
  },
  bar: {
    marginBottom: 8,
  },
  nodeContainer: {
    position: 'absolute',
    top: -12,
    width: 24,
    alignItems: 'center',
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
  userMarker: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  label: {
    fontSize: 12,
    color: '#333',
  },
});
