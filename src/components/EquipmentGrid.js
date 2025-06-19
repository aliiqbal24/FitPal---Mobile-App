import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

export default function EquipmentGrid({ exercises = [] }) {
  const { width, height } = Dimensions.get('window');

  const zoneTop = height * 0.3;
  const zoneBottom = height * 0.15;
  const zoneHeight = height - zoneTop - zoneBottom;
  const zoneWidth = width;

  const cellWidth = zoneWidth / 3;
  const cellHeight = zoneHeight / 3;

  const positions = useMemo(() => {
    const mapping = exercises.length <= 4
      ? [0, 2, 6, 8]
      : [0, 1, 2, 3, 5, 6, 8];

    return mapping.slice(0, exercises.length).map((idx, i) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      return {
        left: col * cellWidth,
        top: row * cellHeight,
        name: exercises[i].name,
      };
    });
  }, [exercises, cellWidth, cellHeight]);

  return (
    <View pointerEvents="none" style={[styles.container, { top: zoneTop, height: zoneHeight, width: zoneWidth }]}>
      {positions.map((pos, idx) => (
        <View
          key={idx}
          style={[styles.box, { left: pos.left, top: pos.top, width: cellWidth, height: cellHeight }]}
        >
          <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
            {pos.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
  },
  box: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
  },
  label: {
    color: '#222',
    fontWeight: '600',
    textAlign: 'center',
  },
});
