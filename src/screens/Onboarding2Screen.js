import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding2Screen({ navigation }) {
  const [month, setMonth] = useState('January');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('2000');

  const handleContinue = () => {
    const birthdate = `${month} ${day}, ${year}`;
    navigation.navigate('Onboarding1', { birthdate });
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const years = Array.from({ length: 100 }, (_, i) => `${2024 - i}`);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>

      {/* Header */}
      <Text style={styles.title}>When were you born?</Text>
      <Text style={styles.subtitle}>
        This will be used to calibrate your custom plan.
      </Text>

      {/* Pickers */}
      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={month}
            onValueChange={(value) => setMonth(value)}
            style={styles.picker}
          >
            {months.map((m) => (
              <Picker.Item label={m} value={m} key={m} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={day}
            onValueChange={(value) => setDay(value)}
            style={styles.picker}
          >
            {days.map((d) => (
              <Picker.Item label={d} value={d} key={d} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={year}
            onValueChange={(value) => setYear(value)}
            style={styles.picker}
          >
            {years.map((y) => (
              <Picker.Item label={y} value={y} key={y} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Continue */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#eee',
    marginHorizontal: 12,
    borderRadius: 2,
  },
  progress: {
    width: '30%',
    height: '100%',
    backgroundColor: '#1C1B1F',
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: Platform.OS === 'ios' ? undefined : 120,
    height: 140,
  },
  continueButton: {
    backgroundColor: '#1C1B1F',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
