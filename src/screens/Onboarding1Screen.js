import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding1Screen({ navigation }) {
  const [useMetric, setUseMetric] = useState(false);
  const [feetIndex, setFeetIndex] = useState(1);
  const [inchIndex, setInchIndex] = useState(6);
  const [cmIndex, setCmIndex] = useState(0);
  const [weightIndex, setWeightIndex] = useState(30);

  const feet = feetIndex + 4;
  const inches = inchIndex;
  const centimeters = cmIndex + 100;
  const weight = weightIndex + 100;

  const handleContinue = () => {
    const height = useMetric ? `${centimeters} cm` : `${feet}ft ${inches}in`;
    const weightFormatted = useMetric ? `${weight} kg` : `${weight} lb`;
    navigation.navigate('Onboarding2', { height, weight: weightFormatted });
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>Build your gym buddy</Text>

      <Text style={styles.title}>Height & weight</Text>
      <Text style={styles.subtitle}>
        This will help us track your bodyweight lifts.
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
              <WheelPickerExpo
                height={180}
                width={100}
                items={Array.from({ length: 5 }, (_, i) => ({
                  label: `${i + 4} ft`,
                  value: i,
                }))}
                initialSelectedIndex={feetIndex}
                onChange={({ index }) => setFeetIndex(index)}
                renderItem={({ label }) => (
                  <Text style={styles.pickerItem}>{label}</Text>
                )}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}></Text>
              <WheelPickerExpo
                height={180}
                width={100}
                items={Array.from({ length: 12 }, (_, i) => ({
                  label: `${i} in`,
                  value: i,
                }))}
                initialSelectedIndex={inchIndex}
                onChange={({ index }) => setInchIndex(index)}
                renderItem={({ label }) => (
                  <Text style={styles.pickerItem}>{label}</Text>
                )}
              />
            </View>
          </>
        ) : (
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Height</Text>
            <WheelPickerExpo
              height={180}
              width={100}
              items={Array.from({ length: 100 }, (_, i) => ({
                label: `${i + 100} cm`,
                value: i,
              }))}
              initialSelectedIndex={cmIndex}
              onChange={({ index }) => setCmIndex(index)}
              renderItem={({ label }) => (
                <Text style={styles.pickerItem}>{label}</Text>
              )}
            />
          </View>
        )}

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Weight</Text>
          <WheelPickerExpo
            height={180}
            width={100}
            items={Array.from({ length: 100 }, (_, i) => {
              const w = i + 100;
              return { label: useMetric ? `${w} kg` : `${w} lb`, value: i };
            })}
            initialSelectedIndex={weightIndex}
            onChange={({ index }) => setWeightIndex(index)}
            renderItem={({ label }) => (
              <Text style={styles.pickerItem}>{label}</Text>
            )}
          />
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
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
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
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: DARK_BLUE,
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
