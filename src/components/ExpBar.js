import React from 'react';
import * as Progress from 'react-native-progress';
import { getLevelInfo } from '../utils/levelUtils';

export default function ExpBar({ exp, width = 150, height = 10 }) {
  const { expThisLevel, expForNext } = getLevelInfo(exp);
  const progress = expForNext > 0 ? expThisLevel / expForNext : 0;
  return (
    <Progress.Bar
      progress={progress}
      width={width}
      height={height}
      color="#4CAF50"
      unfilledColor="#eee"
      borderWidth={0}
    />
  );
}
