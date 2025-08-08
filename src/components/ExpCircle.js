import React from 'react';
import * as Progress from 'react-native-progress';
import { getLevelInfo } from '../utils/levelUtils';
export default function ExpCircle({ exp, size = 100 }) {
  const { expThisLevel, expForNext } = getLevelInfo(exp);
  const progress = expForNext > 0 ? expThisLevel / expForNext : 0;
  return (
    <Progress.Circle
      size={size}
      progress={progress}
      showsText
      formatText={() => `${expThisLevel}/${expForNext}`}
      thickness={8}
      color="#4CAF50"
      unfilledColor="#eee"
    />
  );
}
