import React from 'react';
import * as Progress from 'react-native-progress';

export default function ExpCircle({ exp, totalExp = 20, size = 100 }) {
  const progress = (exp % totalExp) / totalExp;
  return (
    <Progress.Circle
      size={size}
      progress={progress}
      showsText
      formatText={() => `${exp % totalExp}/${totalExp}`}
      thickness={8}
      color="#4CAF50"
      unfilledColor="#eee"
    />
  );
}
