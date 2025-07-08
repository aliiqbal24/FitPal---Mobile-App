import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { getLevelInfo } from '../utils/levelUtils';
export default function ExpBar({ exp, width = 150, height = 10, showFraction = false }) {
  const { expThisLevel, expForNext } = getLevelInfo(exp);
  const progress = expForNext > 0 ? expThisLevel / expForNext : 0;
  const fraction = `${expThisLevel}/${expForNext}`;

  return (
    <View style={{ width }}>
      <Progress.Bar
        progress={progress}
        width={width}
        height={height}
        color="#4CAF50"
        unfilledColor="#eee"
        borderWidth={0}
      />
      {showFraction && (
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Text style={{ color: '#000', fontSize: height * 0.8, fontWeight: '600' }}>{fraction}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
