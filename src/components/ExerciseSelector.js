import React, { useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { EXERCISES } from '../data/exerciseList';

export default function ExerciseSelector({ value, onChange }) {
  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) {
      return ['Barbell Squat', 'Barbell Bench Press', 'Dumbbell Lunge', 'Deadlift'];
    }
    return EXERCISES.filter(ex => ex.toLowerCase().includes(query)).slice(0, 4);
  }, [value]);

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChange}
      />
      {suggestions.map(option => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => onChange(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    color: '#222',
  },
  option: {
    paddingVertical: 6,
  },
  optionText: {
    color: '#222',
  },
});
