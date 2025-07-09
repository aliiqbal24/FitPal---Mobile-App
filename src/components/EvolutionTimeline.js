import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

const NODE_WIDTH = 36;

export default function EvolutionTimeline({ currentLevel }) {
  const stages = [1, 5, 10];
  const maxLevel = 10;
  const lvl = Number(currentLevel) || 0;
  const progress = lvl > 0 ? Math.min(lvl, maxLevel) / maxLevel : 0;
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
            const left =
              lvl === 1
                ? 0
                : (lvl / maxLevel) * barWidth - NODE_WIDTH / 2;
            return (
              <View key={lvl} style={[styles.nodeContainer, { left }]}>
                <View
                  style={[styles.circle, currentLevel >= lvl ? styles.unlocked : styles.locked]}
                />
                <Text style={styles.label} numberOfLines={1}>
                  Lvl {lvl}
                </Text>
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
    width: NODE_WIDTH,
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
