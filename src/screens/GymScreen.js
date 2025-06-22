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
  Alert,
  Animated,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useHistory } from '../context/HistoryContext';
import { toDateKey } from '../utils/dateUtils';
import ExpCircle from '../components/ExpCircle';
import TouchHandler from '../systems/TouchHandler';
import ExerciseSelector from '../components/ExerciseSelector';
import EquipmentGrid from '../components/EquipmentGrid';
import { useCharacter } from '../context/CharacterContext';

const SPRITE = require('../../assets/AppSprite.png');
const SPRITE_SIZE = 120;

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Character = React.memo(({ body }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View style={[styles.character, { left: x, top: y, width, height }]}> 
      <Image source={SPRITE} style={styles.sprite} resizeMode="contain" />
    </View>
  );
});

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const WiggleItem = React.memo(function WiggleItem({ deleteMode, style, children, ...rest }) {
  const anim = useRef(new Animated.Value(0)).current;
  const loop = useRef();

  useEffect(() => {
    if (deleteMode) {
      anim.setValue(0);
      loop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }),
          Animated.timing(anim, { toValue: -1, duration: 80, useNativeDriver: true }),
        ])
      );
      loop.current.start();
    } else {
      if (loop.current) {
        loop.current.stop();
      }
      Animated.timing(anim, { toValue: 0, duration: 80, useNativeDriver: true }).start(({ finished }) => {
        if (finished) {
          anim.setValue(0);
        }
      });
    }

    return () => {
      if (loop.current) {
        loop.current.stop();
      }
      anim.setValue(0);
    };
  }, [deleteMode, anim]);

  const rotate = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <AnimatedTouchable
      {...rest}
      style={[
        style,
        {
          transform: [{ rotate: deleteMode ? rotate : '0deg' }],
        },
      ]}
    >
      {children}
    </AnimatedTouchable>
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
  const [workoutActive, setWorkoutActive] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [setCounts, setSetCounts] = useState([]);
  const { addEntry } = useHistory();

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

  const { exp, level, addExp } = useCharacter();
  const [showStatsModal, setShowStatsModal] = useState(false);

  const showStats = useCallback(() => {
    setShowStatsModal(true);
  }, []);

  const entities = {
    physics: { engine: engine.current, world },
    character: { body: characterBody },
  };

  const onEvent = useCallback(
    e => {
      if (e.type === 'show-stats') {
        showStats();
      }
    },
    [showStats]
  );

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
    if (workoutActive) {
      Alert.alert('Workout Active', 'End the current workout to add a new one.');
      return;
    }
    if (workouts.length >= 3) {
      Alert.alert('Upgrade Required', 'Upgrade to pro for more');
      return;
    }
    setWorkoutName('');
    setCurrentWorkoutIdx(null);
    setShowWorkoutModal(true);
  };

  const openEditWorkout = idx => {
    if (workoutActive) {
      Alert.alert('Workout Active', 'End the current workout to edit workouts.');
      return;
    }
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
      if (workouts.length >= 3) {
        Alert.alert('Upgrade Required', 'Upgrade to pro for more');
        return;
      }
      setWorkouts(w => [
        ...w,
        { name: workoutName, exercises: [], date: new Date().toISOString() },
      ]);
      setSelectedWorkoutIdx(workouts.length);
    }
    setShowWorkoutModal(false);
  };

  const handleDeleteWorkout = idx => {
    if (workoutActive) {
      Alert.alert('Workout Active', 'End the current workout to delete a workout.');
      return;
    }
    const name = workouts[idx].name;
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWorkouts(w => w.filter((_, i) => i !== idx));
            setDeleteMode(false);
          },
        },
      ]
    );
  };

  const openNewExercise = idx => {
    if (workoutActive) {
      Alert.alert('Workout Active', 'End the current workout to edit exercises.');
      return;
    }
    setCurrentWorkoutIdx(idx);
    setExerciseForm({ name: '', sets: '', reps: '', weight: '' });
    setEditingExerciseIdx(null);
    setShowExerciseModal(true);
  };

  const openEditExercise = (workoutIdx, exerciseIdx) => {
    if (workoutActive) {
      Alert.alert('Workout Active', 'End the current workout to edit exercises.');
      return;
    }
    const ex = workouts[workoutIdx].exercises[exerciseIdx];
    setCurrentWorkoutIdx(workoutIdx);
    setExerciseForm(ex);
    setEditingExerciseIdx(exerciseIdx);
    setShowExerciseModal(true);
  };

  const handleSaveExercise = () => {
    let setsNum = parseInt(exerciseForm.sets, 10);
    if (Number.isNaN(setsNum)) setsNum = 0;
    if (setsNum > 12) {
      setsNum = 12;
      Alert.alert('Limit Reached', 'Sets cannot exceed 12.');
    }
    const ex = { ...exerciseForm, sets: String(setsNum) };
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

  const handleDeleteExercise = () => {
    if (editingExerciseIdx === null) return;
    setWorkouts(w => {
      const updated = [...w];
      updated[currentWorkoutIdx].exercises = updated[currentWorkoutIdx].exercises.filter((_, i) => i !== editingExerciseIdx);
      return updated;
    });
    setShowExerciseModal(false);
  };
  const currentExercises = workouts[selectedWorkoutIdx]?.exercises ?? [];

  const toggleWorkout = useCallback(() => {
    setWorkoutActive(active => {
      const next = !active;
      if (active && !next) {
        const dateStr = toDateKey();
        addEntry(dateStr, {
          ...workouts[selectedWorkoutIdx],
          completedSets: setCounts,
        });
        setSetCounts([]);
      } else if (next) {
        setSetCounts(currentExercises.map(() => 0));
      }
      return next;
    });
  }, [workouts, selectedWorkoutIdx, currentExercises, addEntry]);

  useEffect(() => {
    if (workoutActive) {
      setSetCounts(prev =>
        currentExercises.map((ex, i) => {
          const max = parseInt(ex.sets, 10) || 0;
          return Math.min(prev[i] || 0, max);
        })
      );
    }
  }, [workouts, selectedWorkoutIdx, workoutActive]);

  const incrementSet = useCallback(
    idx => {
      let didIncrement = false;
      setSetCounts(prev => {
        const updated = [...prev];
        const max = parseInt(currentExercises[idx]?.sets, 10) || 0;
        const current = prev[idx] || 0;
        if (current < max) {
          didIncrement = true;
          updated[idx] = current + 1;
        }
        return updated;
      });
      if (didIncrement) {
        addExp(1);
      }
    },
    [currentExercises]
  );

  return (
    <ImageBackground
      source={require('../../assets/app_background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={{flex: 1}} pointerEvents="box-none">
      <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {workouts[selectedWorkoutIdx] && (
          <View key={selectedWorkoutIdx} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{workouts[selectedWorkoutIdx].name}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => openEditWorkout(selectedWorkoutIdx)}>
                  <Ionicons name="create-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteWorkout(selectedWorkoutIdx)}
                >
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
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
      <View style={styles.expImageWrapper}>
        <TouchableOpacity onPress={showStats}>
          <Image
            source={require('../../assets/AppSprite.png')}
            style={styles.expImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gameContainer}>
        <GameEngine
          systems={[Physics, TouchHandler]}
          entities={entities}
          style={styles.engine}
          onEvent={onEvent}
        >
          <Character body={characterBody} />
        </GameEngine>
      </View>
      {workoutActive && (
        <EquipmentGrid
          exercises={currentExercises}
          progress={setCounts}
          onIncrement={incrementSet}
        />
      )}

      <View style={styles.carouselContainer}>
        <ScrollView
          style={styles.carouselScrollView}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScroll}
        >
          {workouts.map((wk, idx) => (
            <WiggleItem
              key={idx}
              deleteMode={deleteMode}
              style={[
                styles.carouselItem,
                selectedWorkoutIdx === idx && styles.carouselItemSelected,
              ]}
              onLongPress={() => setDeleteMode(true)}
              onPress={() => {
                if (deleteMode) {
                  setDeleteMode(false);
                } else if (workoutActive) {
                  Alert.alert('Workout Active', 'End the current workout to switch workouts.');
                } else {
                  setSelectedWorkoutIdx(idx);
                }
              }}
            >
              <Text
                style={[
                  styles.carouselItemText,
                  selectedWorkoutIdx === idx && styles.carouselItemTextSelected,
                ]}
              >
                {wk.name}
              </Text>
              {deleteMode && (
                <TouchableOpacity
                  style={styles.carouselDelete}
                  onPress={() => handleDeleteWorkout(idx)}
                >
                  <Ionicons name="close" size={12} color="#fff" />
                </TouchableOpacity>
              )}
            </WiggleItem>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.addWorkoutBtn} onPress={openNewWorkout}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.workoutToggleBtn} onPress={toggleWorkout}>
        <Text style={styles.workoutToggleBtnText}>
          {workoutActive ? 'END' : 'LIFT'}
        </Text>
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
            {editingExerciseIdx !== null && (
              <TouchableOpacity
                style={styles.exerciseDelete}
                onPress={handleDeleteExercise}
              >
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            )}
            <Text style={styles.modalTitle}>
              {editingExerciseIdx !== null ? 'Edit Exercise' : 'New Exercise'}
            </Text>
            <ExerciseSelector
              value={exerciseForm.name}
              onChange={t => setExerciseForm({ ...exerciseForm, name: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Sets"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={exerciseForm.sets}
              onChangeText={t => {
                let num = parseInt(t, 10);
                if (!Number.isNaN(num)) {
                  if (num > 12) {
                    num = 12;
                    Alert.alert('Limit Reached', 'Sets cannot exceed 12.');
                  }
                  setExerciseForm({ ...exerciseForm, sets: String(num) });
                } else {
                  setExerciseForm({ ...exerciseForm, sets: t });
                }
              }}
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
    </View>
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
    width: '55%',
    alignSelf: 'center',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 8,
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
    overflow: 'visible',
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
  exerciseDelete: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  carouselContainer: {
    paddingBottom: 12,
    paddingTop: 20,
    marginTop: -8,
  },
  carouselScrollView: {
    overflow: 'visible',
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
  carouselDelete: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItemText: {
    color: '#222',
    fontWeight: '600',
  },
  carouselItemTextSelected: {
    color: '#fff',
  },
  expImageWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  expImage: {
    width: 150,
    height: 150,
  },
  workoutToggleBtn: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 100,
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 26,
  },
  workoutToggleBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 21,
  },
});
