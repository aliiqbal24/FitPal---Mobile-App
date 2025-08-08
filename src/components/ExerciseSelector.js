import React, { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { EXERCISES } from '../data/exerciseList';

export default function ExerciseSelector({ value, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
      
  const query = value.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!query) return [];
    return EXERCISES.filter(ex => ex.toLowerCase().includes(query)).slice(0, 4);
  }, [query]);

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Exercise Name"
        placeholderTextColor="#888"
        value={value}
        onChangeText={text => {
          onChange(text);
          setShowSuggestions(text.trim().length > 0);
        }}
      />
      {showSuggestions &&
        suggestions.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => {
              onChange(option);
              setShowSuggestions(false);
            }}
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
    color: '#fff',
    backgroundColor: '#333',
  },
  option: {
    paddingVertical: 6,
    backgroundColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  optionText: {
    color: '#fff',
  },
});
