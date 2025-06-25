import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTER_OPTIONS } from '../data/characters';

export default function Onboarding3Screen({ navigation }) {
  const { characterId, setCharacterId } = useCharacter();
  const [selected, setSelected] = useState(characterId);

  const handleContinue = () => {
    setCharacterId(selected);
    navigation.navigate('Tabs');
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
      <Text style={styles.title}>Choose your gym buddy:</Text>
      <View style={styles.options}>
        {CHARACTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.option, selected === opt.id && styles.optionSelected]}
            onPress={() => setSelected(opt.id)}
          >
            <Image source={opt.image} style={styles.avatar} />
          </TouchableOpacity>
        ))}
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
    width: '40%',
    height: '100%',
    backgroundColor: DARK,
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 30,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  option: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: DARK,
    backgroundColor: '#F0F0F0',
  },
  avatar: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
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
