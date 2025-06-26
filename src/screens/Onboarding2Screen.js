import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding2Screen({ navigation }) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [yearIndex, setYearIndex] = useState(24);

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

  const month = months[monthIndex];
  const day = days[dayIndex];
  const year = years[yearIndex];

  const handleContinue = () => {
    const birthdate = `${month} ${day}, ${year}`;
    navigation.navigate('Onboarding3', { birthdate });
  };

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
          <WheelPickerExpo
            height={180}
            width={100}
            items={months.map((m, i) => ({ label: m, value: i }))}
            initialSelectedIndex={monthIndex}
            onChange={({ index }) => setMonthIndex(index)}
            renderItem={({ item }) => (
              <Text style={styles.pickerItem}>{item.label}</Text>
            )}
          />
        </View>

        <View style={styles.pickerContainer}>
          <WheelPickerExpo
            height={180}
            width={100}
            items={days.map((d, i) => ({ label: d, value: i }))}
            initialSelectedIndex={dayIndex}
            onChange={({ index }) => setDayIndex(index)}
            renderItem={({ item }) => (
              <Text style={styles.pickerItem}>{item.label}</Text>
            )}
          />
        </View>

        <View style={styles.pickerContainer}>
          <WheelPickerExpo
            height={180}
            width={100}
            items={years.map((y, i) => ({ label: y, value: i }))}
            initialSelectedIndex={yearIndex}
            onChange={({ index }) => setYearIndex(index)}
            renderItem={({ item }) => (
              <Text style={styles.pickerItem}>{item.label}</Text>
            )}
          />
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
    justifyContent: 'flex-start',
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
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#1C1B1F',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  pickerItem: {
    fontSize: 24,
    textAlign: 'center',
  },
});
