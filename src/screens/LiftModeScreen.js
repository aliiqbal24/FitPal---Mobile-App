import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ExerciseRow from '../components/ExerciseRow';
import { CHARACTER_IMAGES } from '../data/characters';
import { useCharacter } from '../context/CharacterContext';

export default function LiftModeScreen() {
  const [exercises, setExercises] = useState([
    { name: 'Barbell Squat', sets: 3, weight: 60, reps: 10, completed: 0 },
    { name: 'Dumbbell Bench Press', sets: 3, weight: 25, reps: 8, completed: 0 },
    { name: 'Lat Pulldown (Cable Machine)', sets: 3, weight: 40, reps: 10, completed: 0 },
  ]);
  const openRow = useRef(null);
  const { characterId } = useCharacter();
  const navigation = useNavigation();
  const petSprite = CHARACTER_IMAGES[characterId];
  const [activeIndex, setActiveIndex] = useState(0);
  const [edit, setEdit] = useState({ index: null, field: null, value: '' });
  const rowAnim = useRef(
    exercises.map((_, i) => new Animated.Value(i % 2 === 0 ? -300 : 300))
  ).current;

  useEffect(() => {
    const animations = rowAnim.map((anim, idx) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        delay: idx * 150,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, [rowAnim]);

  const handleAddSet = index => {
    setExercises(prev => {
      const arr = [...prev];
      const ex = { ...arr[index] };
      if (ex.completed < ex.sets) {
        ex.completed += 1;
        arr[index] = ex;
      }
      return arr;
    });
    setActiveIndex(index);
  };

  const handleEdit = (index, field) => {
    setEdit({ index, field, value: String(exercises[index][field]) });
  };

  const saveEdit = () => {
    setExercises(prev => {
      const arr = [...prev];
      const ex = { ...arr[edit.index], [edit.field]: Number(edit.value) };
      arr[edit.index] = ex;
      return arr;
    });
    setEdit({ index: null, field: null, value: '' });
  };

  return (
    <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {exercises.map((ex, idx) => (
          <Animated.View
            key={idx}
            style={{ transform: [{ translateX: rowAnim[idx] }] }}
          >
            <ExerciseRow
              exercise={ex}
              isActive={idx === activeIndex}
              onAddSet={() => handleAddSet(idx)}
              onEdit={field => handleEdit(idx, field)}
              openRef={openRow}
              setOpenRef={ref => (openRow.current = ref)}
              petSprite={idx === activeIndex ? petSprite : null}
            />
          </Animated.View>
        ))}
        <TouchableOpacity style={styles.endButton} onPress={() => navigation.goBack()}>
          <Text style={styles.endText}>End Workout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={edit.index != null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TextInput
              value={edit.value}
              onChangeText={text => setEdit(e => ({ ...e, value: text }))}
              keyboardType="numeric"
              style={styles.input}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setEdit({ index: null, field: null, value: '' })}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={saveEdit}>
                <Text style={[styles.modalBtnText, styles.saveBtnText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  endButton: {
    marginTop: 12,
    backgroundColor: '#1db954',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  endText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 200,
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    padding: 8,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#1db954',
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveBtnText: {
    color: '#111',
  },
});
