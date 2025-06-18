import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  Button,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ExpCircle from '../components/ExpCircle';

const SPRITE = require('../../assets/AppSprite.png');
const SPRITE_SIZE = 120;

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Character = React.memo(({ body, onPress }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.character, { left: x, top: y, width, height }]}
    >
      <Image source={SPRITE} style={styles.sprite} resizeMode="contain" />
    </TouchableOpacity>
  );
});

export default function GymScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [currentWorkoutIdx, setCurrentWorkoutIdx] = useState(null);
  const [selectedWorkoutIdx, setSelectedWorkoutIdx] = useState(0);

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

  const engine = useRef(Matter.Engine.create({ enableSleeping: false }));
  const world = engine.current.world;
  const { width, height } = Dimensions.get('window');

  const characterBody = useRef(
    Matter.Bodies.rectangle(width / 2, height / 2, SPRITE_SIZE, SPRITE_SIZE, {
      isStatic: true,
    })
  ).current;

  useEffect(() => {
    Matter.World.add(world, [characterBody]);
    return () => {
      Matter.World.clear(world);
      Matter.Engine.clear(engine.current);
    };
  }, [world, characterBody]);

  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const addSet = useCallback(() => {
    setExp(e => e + 1);
  }, []);

  useEffect(() => {
    const newLevel = Math.floor(exp / 20) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [exp, level]);

  const showStats = useCallback(() => {
    setShowStatsModal(true);
  }, []);

  const entities = {
    physics: { engine: engine.current, world },
    character: { body: characterBody },
  };

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

  // ensure selected workout index stays valid when workouts change
  useEffect(() => {
    if (selectedWorkoutIdx >= workouts.length && workouts.length > 0) {
      setSelectedWorkoutIdx(workouts.length - 1);
    }
  }, [workouts, selectedWorkoutIdx]);

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
    setSelectedWorkoutIdx(idx);
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
      setSelectedWorkoutIdx(workouts.length);
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
    <ImageBackground
      source={require('../../assets/app_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
      <View style={styles.gameContainer}>
        <GameEngine systems={[Physics]} entities={entities} style={styles.engine}>
          <Character body={characterBody} onPress={showStats} />
        </GameEngine>
        <View style={styles.buttonContainer}>
          <Button title="+ Set" onPress={addSet} />
        </View>
      </View>
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScroll}
        >
          {workouts.map((wk, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.carouselItem,
                selectedWorkoutIdx === idx && styles.carouselItemSelected,
              ]}
              onPress={() => setSelectedWorkoutIdx(idx)}
            >
              <Text
                style={[
                  styles.carouselItemText,
                  selectedWorkoutIdx === idx && styles.carouselItemTextSelected,
                ]}
              >
                {wk.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {workouts[selectedWorkoutIdx] && (
          <View key={selectedWorkoutIdx} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{workouts[selectedWorkoutIdx].name}</Text>
              <TouchableOpacity onPress={() => openEditWorkout(selectedWorkoutIdx)}>
                <Ionicons name="create-outline" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {workouts[selectedWorkoutIdx].exercises.map((ex, eIdx) => (
              <TouchableOpacity
                key={eIdx}
                style={styles.exerciseRow}
                onPress={() => openEditExercise(selectedWorkoutIdx, eIdx)}
              >
                <Text style={styles.exerciseText}>
                  {ex.name} - {ex.sets}x{ex.reps} @ {ex.weight}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addExerciseBtn}
              onPress={() => openNewExercise(selectedWorkoutIdx)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        )}
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

      {/* Stats Modal */}
      <Modal visible={showStatsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Character Stats</Text>
            <Text style={styles.levelText}>Level {level}</Text>
            <View style={styles.circleWrapper}>
              <ExpCircle exp={exp} />
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  levelText: {
    fontSize: 18,
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  circleWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  gameContainer: {
    height: 200,
  },
  engine: {
    flex: 1,
  },
  character: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprite: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  carouselContainer: {
    paddingVertical: 12,
  },
  carouselScroll: {
    paddingHorizontal: 16,
  },
  carouselItem: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  carouselItemSelected: {
    backgroundColor: '#007AFF',
  },
  carouselItemText: {
    color: '#222',
    fontWeight: '600',
  },
  carouselItemTextSelected: {
    color: '#fff',
  },
});
