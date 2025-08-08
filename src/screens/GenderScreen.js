import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState('Male');
  const genderOptions = ['Male', 'Female', 'Other'];

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate('Onboarding1', { gender: selectedGender });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>

      <View>
        <Text style={styles.title}>Choose your Gender</Text>
        <Text style={styles.subtitle}>This will be used to calibrate your custom plan.</Text>
      </View>

      <View style={styles.optionsContainer}>
        {genderOptions.map((option) => {
          const isSelected = selectedGender === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, isSelected ? styles.selected : styles.unselected]}
              onPress={() => setSelectedGender(option)}
            >
              <Text style={isSelected ? styles.selectedText : styles.unselectedText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const DARK = '#1C1B1F';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 40,
  },
  optionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: DARK,
  },
  unselected: {
    borderWidth: 1,
    borderColor: DARK,
    backgroundColor: '#fff',
  },
  selectedText: {
    color: '#fff',
    fontSize: 16,
  },
  unselectedText: {
    color: DARK,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: DARK,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
