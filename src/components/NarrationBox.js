import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NarrationBox({ text, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEB3B',
    borderColor: 'black',
    borderWidth: 3,
    padding: 10,
  },
  text: {
    fontFamily: 'Comic Neue',
    fontSize: 14,
  },
});
