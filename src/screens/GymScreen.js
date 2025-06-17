import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function GymScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [currentWorkoutIdx, setCurrentWorkoutIdx] = useState(null);

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
  });
  const [editingExerciseIdx, setEditingExerciseIdx] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('workouts');
      if (stored) {
        try {
          setWorkouts(JSON.parse(stored));
        } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const getStartOfWeek = date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const computeSummary = weekWorkouts => {
    let totalSets = 0;
    let totalWeight = 0;
    const exerciseCounts = {};

    weekWorkouts.forEach(w => {
      w.exercises.forEach(ex => {
        const sets = parseInt(ex.sets) || 0;
        const reps = parseInt(ex.reps) || 0;
        const weight = parseFloat(ex.weight) || 0;
        totalSets += sets;
        totalWeight += sets * reps * weight;
        exerciseCounts[ex.name] = (exerciseCounts[ex.name] || 0) + sets;
      });
    });

    let favoriteExercise = null;
    let maxSets = 0;
    Object.entries(exerciseCounts).forEach(([name, sets]) => {
      if (sets > maxSets) {
        maxSets = sets;
        favoriteExercise = name;
      }
    });

    return { totalSets, totalWeight, favoriteExercise };
  };

  const checkWeeklySummary = async () => {
    const now = new Date();
    const startOfThisWeek = getStartOfWeek(now);
    const lastShown = await AsyncStorage.getItem('lastSummaryShown');
    if (!lastShown || parseInt(lastShown) < startOfThisWeek.getTime()) {
      const prevWeekStart = new Date(startOfThisWeek);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const weekWorkouts = workouts.filter(w => {
        const dt = new Date(w.date);
        return dt >= prevWeekStart && dt < startOfThisWeek;
      });
      if (weekWorkouts.length) {
        setWeeklySummary(computeSummary(weekWorkouts));
        setShowSummaryModal(true);
      }
      await AsyncStorage.setItem('lastSummaryShown', String(now.getTime()));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkWeeklySummary();
    }, [workouts])
  );

  const openNewWorkout = () => {
    setWorkoutName('');
    setCurrentWorkoutIdx(null);
    setShowWorkoutModal(true);
  };

  const openEditWorkout = idx => {
    setWorkoutName(workouts[idx].name);
    setCurrentWorkoutIdx(idx);
    setShowWorkoutModal(true);
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) return;
    if (currentWorkoutIdx !== null) {
      setWorkouts(w =>
        w.map((wk, i) => (i === currentWorkoutIdx ? { ...wk, name: workoutName } : wk))
      );
    } else {
      setWorkouts(w => [
        ...w,
        { name: workoutName, exercises: [], date: new Date().toISOString() },
      ]);
    }
    setShowWorkoutModal(false);
  };

  const openNewExercise = idx => {
    setCurrentWorkoutIdx(idx);
    setExerciseForm({ name: '', sets: '', reps: '', weight: '' });
    setEditingExerciseIdx(null);
    setShowExerciseModal(true);
  };

  const openEditExercise = (workoutIdx, exerciseIdx) => {
    const ex = workouts[workoutIdx].exercises[exerciseIdx];
    setCurrentWorkoutIdx(workoutIdx);
    setExerciseForm(ex);
    setEditingExerciseIdx(exerciseIdx);
    setShowExerciseModal(true);
  };

  const handleSaveExercise = () => {
    const ex = { ...exerciseForm };
    setWorkouts(w => {
      const updated = [...w];
      const exercises = updated[currentWorkoutIdx].exercises;
      if (editingExerciseIdx !== null) {
        exercises[editingExerciseIdx] = ex;
      } else {
        exercises.push(ex);
      }
      return updated;
    });
    setShowExerciseModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {workouts.map((wk, wIdx) => (
          <View key={wIdx} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{wk.name}</Text>
              <TouchableOpacity onPress={() => openEditWorkout(wIdx)}>
                <Ionicons name="create-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {wk.exercises.map((ex, eIdx) => (
              <TouchableOpacity
                key={eIdx}
                style={styles.exerciseRow}
                onPress={() => openEditExercise(wIdx, eIdx)}
              >
                <Text style={styles.exerciseText}>
                  {ex.name} - {ex.sets}x{ex.reps} @ {ex.weight}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addExerciseBtn}
              onPress={() => openNewExercise(wIdx)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addWorkoutBtn} onPress={openNewWorkout}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Summary Modal */}
      <Modal visible={showSummaryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Weekly Summary</Text>
            {weeklySummary && (
              <>
                <Text style={styles.summaryText}>Total Sets: {weeklySummary.totalSets}</Text>
                <Text style={styles.summaryText}>Total Weight: {weeklySummary.totalWeight}</Text>
                <Text style={styles.summaryText}>Favorite Exercise: {weeklySummary.favoriteExercise}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSummaryModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Workout Modal */}
      <Modal visible={showWorkoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentWorkoutIdx !== null ? 'Edit Workout' : 'New Workout'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Workout Name"
              placeholderTextColor="#888"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveWorkout}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowWorkoutModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exercise Modal */}
      <Modal visible={showExerciseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingExerciseIdx !== null ? 'Edit Exercise' : 'New Exercise'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              placeholderTextColor="#888"
              value={exerciseForm.name}
              onChangeText={t => setExerciseForm({ ...exerciseForm, name: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Sets"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={exerciseForm.sets}
              onChangeText={t => setExerciseForm({ ...exerciseForm, sets: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={exerciseForm.reps}
              onChangeText={t => setExerciseForm({ ...exerciseForm, reps: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={exerciseForm.weight}
              onChangeText={t => setExerciseForm({ ...exerciseForm, weight: t })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveExercise}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowExerciseModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  exerciseRow: {
    paddingVertical: 4,
  },
  exerciseText: {
    color: '#222',
  },
  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addExerciseText: {
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '600',
  },
  addWorkoutBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    color: '#222',
  },
  summaryText: {
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalCancelText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
