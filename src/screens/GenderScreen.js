import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GenderScreen({ navigation }) {
  const [selectedGender, setSelectedGender] = useState('Male');
  const genderOptions = ['Male', 'Female', 'Other'];

  const handleContinue = () => {
    if (selectedGender) {
      navigation.navigate('Onboarding1', { gender: selectedGender });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
        <TouchableOpacity>
          <Text style={styles.lang}>🇺🇸 EN</Text>
        </TouchableOpacity>
      </View>

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#eee',
    marginHorizontal: 12,
    borderRadius: 2,
  },
  progress: {
    width: '10%',
    height: '100%',
    backgroundColor: DARK,
    borderRadius: 2,
  },
  lang: {
    fontSize: 12,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
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
