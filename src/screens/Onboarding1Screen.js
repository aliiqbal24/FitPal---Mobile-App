import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding1Screen({ navigation }) {
  const [useMetric, setUseMetric] = useState(false);
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('6');
  const [weight, setWeight] = useState('120');

  const handleContinue = () => {
    const height = useMetric ? `${feet} cm` : `${feet}ft ${inches}in`;
    const weightFormatted = useMetric ? `${weight} kg` : `${weight} lb`;
    navigation.navigate('Onboarding2', { height, weight: weightFormatted });
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
      </View>

      <Text style={styles.title}>Height & weight</Text>
      <Text style={styles.subtitle}>
        This will be used to calibrate your custom plan.
      </Text>

      <View style={styles.unitToggle}>
        <Text style={!useMetric ? styles.unitActive : styles.unitInactive}>Imperial</Text>
        <Switch
          value={useMetric}
          onValueChange={setUseMetric}
          trackColor={{ false: '#ccc', true: '#ccc' }}
          thumbColor={useMetric ? '#1C1B1F' : '#f4f3f4'}
        />
        <Text style={useMetric ? styles.unitActive : styles.unitInactive}>Metric</Text>
      </View>

      <View style={styles.pickerRow}>
        {!useMetric ? (
          <>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Height</Text>
              <Picker
                selectedValue={feet}
                onValueChange={(itemValue) => setFeet(itemValue)}
                style={styles.picker}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Picker.Item
                    label={`${i + 4} ft`}
                    value={`${i + 4}`}
                    key={`ft-${i}`}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}></Text>
              <Picker
                selectedValue={inches}
                onValueChange={(itemValue) => setInches(itemValue)}
                style={styles.picker}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item
                    label={`${i} in`}
                    value={`${i}`}
                    key={`in-${i}`}
                  />
                ))}
              </Picker>
            </View>
          </>
        ) : (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Height</Text>
            <Picker
              selectedValue={feet}
              onValueChange={(itemValue) => setFeet(itemValue)}
              style={styles.picker}
            >
              {Array.from({ length: 100 }, (_, i) => (
                <Picker.Item
                  label={`${i + 100} cm`}
                  value={`${i + 100}`}
                  key={`cm-${i}`}
                />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Weight</Text>
          <Picker
            selectedValue={weight}
            onValueChange={(itemValue) => setWeight(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const w = i + 100;
              return (
                <Picker.Item
                  label={useMetric ? `${w} kg` : `${w} lb`}
                  value={`${w}`}
                  key={`wt-${w}`}
                />
              );
            })}
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const DARK_BLUE = '#1C1B1F';

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
    width: '20%',
    height: '100%',
    backgroundColor: DARK_BLUE,
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
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  unitActive: {
    fontWeight: '600',
    fontSize: 16,
    marginHorizontal: 10,
    color: '#000',
  },
  unitInactive: {
    fontWeight: '400',
    fontSize: 16,
    marginHorizontal: 10,
    color: '#aaa',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  picker: {
    width: Platform.OS === 'ios' ? undefined : 120,
    height: 120,
  },
  continueButton: {
    backgroundColor: DARK_BLUE,
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
