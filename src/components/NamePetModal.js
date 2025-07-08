import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Filter } from 'bad-words';
import AvatarWithLevelBadge from './AvatarWithLevelBadge';
import ExpBar from './ExpBar';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTER_IMAGES } from '../data/characters';

export default function NamePetModal({ visible, onClose }) {
  const { characterId, setPetName, setPetGender, setCharacterId } = useCharacter();
  const sprite = CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES.Gorilla1;
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [showExp, setShowExp] = useState(false);

  const handleSave = () => {
    const filter = new Filter();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (filter.isProfane(trimmed)) {
      Alert.alert('Inappropriate Name', 'Please choose a different name.');
      return;
    }
    setPetName(trimmed);
    setPetGender(gender);
    // ensure starting sprite
    setCharacterId('Gorilla1');
    setShowExp(true);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={showExp ? onClose : undefined}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.row}>
              <AvatarWithLevelBadge source={sprite} size={80} level={1} />
              <View style={styles.right}>
                {!showExp && (
                  <>
                    <Text style={styles.label}>Name your buddy</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter name"
                      placeholderTextColor="#888"
                      value={name}
                      onChangeText={setName}
                    />
                    <View style={styles.genderRow}>
                      {['Male', 'Female'].map(opt => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.genderButton,
                            gender === opt && styles.genderSelected,
                          ]}
                          onPress={() => setGender(opt)}
                        >
                          <Text
                            style={gender === opt ? styles.genderSelectedText : styles.genderText}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                      <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                  </>
                )}
                {showExp && (
                  <>
                    <Text style={styles.savedText}>Great! Meet {name.trim()}.</Text>
                    <View style={styles.expBar}>
                      <ExpBar exp={0} width={100} height={8} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                      <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    color: '#222',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#4CAF50',
  },
  genderText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  genderSelectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  savedText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#222',
  },
  expBar: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
});
