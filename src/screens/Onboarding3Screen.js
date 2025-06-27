import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTER_OPTIONS } from '../data/characters';
import { Filter } from 'bad-words';

export default function Onboarding3Screen({ navigation }) {
  const { characterId, petName, setCharacterId, setPetName } = useCharacter();
  const [selected, setSelected] = useState(characterId);
  const [name, setName] = useState(petName);
  const filter = new Filter();

  const handleContinue = () => {
    if (!name || filter.isProfane(name)) {
      Alert.alert('Invalid Name', 'Please choose an appropriate pet name.');
      return;
    }
    setCharacterId(selected);
    setPetName(name.trim());
    navigation.navigate('Onboarding4');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.options}>
        {CHARACTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.option,
              selected === opt.id && styles.optionSelected,
            ]}
            onPress={() => setSelected(opt.id)}
          >
            <Image source={opt.image} style={styles.avatar} />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    color: '#222',
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
