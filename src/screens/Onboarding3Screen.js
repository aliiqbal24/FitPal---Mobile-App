import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function Onboarding3Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose your gym buddy:</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 20,
  },
});
