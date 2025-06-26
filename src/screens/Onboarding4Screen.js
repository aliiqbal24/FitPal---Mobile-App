import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBackground } from '../context/BackgroundContext';

export default function Onboarding4Screen({ navigation }) {
  const { background, setBackground } = useBackground();
  const [selected, setSelected] = useState(background);

  const handleContinue = () => {
    setBackground(selected);
    // Navigate to the Gym tab inside the Tab navigator
    navigation.navigate('Tabs', { screen: 'Gym' });
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

      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.option, selected === 'oldschool' && styles.optionSelected]}
          onPress={() => setSelected('oldschool')}
        >
          <Image
            source={require('../../assets/backgrounds/APP_BG_oldschool.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Oldschool</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === 'newschool' && styles.optionSelected]}
          onPress={() => setSelected('newschool')}
        >
          <Image
            source={require('../../assets/backgrounds/APP_BG_newschool.png')}
            style={styles.image}
          />
          <Text style={styles.label}>Newschool</Text>
        </TouchableOpacity>
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
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#eee',
    marginHorizontal: 12,
    borderRadius: 2,
  },
  progress: {
    width: '50%',
    height: '100%',
    backgroundColor: DARK,
    borderRadius: 2,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  option: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionSelected: {
    borderColor: DARK,
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: DARK,
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
