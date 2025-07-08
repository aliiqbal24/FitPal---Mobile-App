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
  TouchableWithoutFeedback,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useHistory } from '../context/HistoryContext';
import { useStats } from '../context/StatsContext';
import { toDateKey } from '../utils/dateUtils';
import AvatarWithLevelBadge from '../components/AvatarWithLevelBadge';
import ExpBar from '../components/ExpBar';
import TouchHandler from '../systems/TouchHandler';
import ExerciseSelector from '../components/ExerciseSelector';
import EquipmentGrid from '../components/EquipmentGrid';
import LevelUpModal from '../components/LevelUpModal';
import NamePetModal from '../components/NamePetModal';
import QuickWorkoutModal from '../components/QuickWorkoutModal';
import SignInModal from '../components/SignInModal';
import PokemonStatsCard from '../components/PokemonStatsCard';
import { useAuth } from '../context/AuthContext';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTER_IMAGES } from '../data/characters';
import { useBackground } from '../context/BackgroundContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigation } from '@react-navigation/native';
import oldBG from '../../assets/backgrounds/APP_BG_oldschool.png';
import newBG from '../../assets/backgrounds/APP_BG_newschool.png';
import { TEST_MODE } from '../utils/config';

const TUTORIAL_KEY = 'tutorialCompleted';

const SPRITE_SIZE = 120;

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Character = React.memo(({ body, sprite, petName }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View style={[styles.character, { left: x, top: y, width, height }]}>
      {petName ? <Text style={styles.petName}>{petName}</Text> : null}
      <Image source={sprite} style={styles.sprite} resizeMode="contain" />
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
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameModalShown, setNameModalShown] = useState(false);
  const [showQuickWorkoutModal, setShowQuickWorkoutModal] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAuthPrompt, setPendingAuthPrompt] = useState(false);
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const arrowLoop = useRef();

  const arrowStyle = React.useMemo(() => {
    switch (tutorialStep) {
      case 1:
        return { right: 40, bottom: 80 };
      case 2:
        return { alignSelf: 'center', bottom: 320 };
      case 3:
        return { alignSelf: 'center', bottom: 250 };
      case 4:
        return { alignSelf: 'center', bottom: 150 };
      default:
        return {};
    }
  }, [tutorialStep]);

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem(TUTORIAL_KEY);
      if (done === 'true') {
        setTutorialCompleted(true);
      }
    })();
  }, []);

  const engine = useRef(Matter.Engine.create({ enableSleeping: false }));
  const world = engine.current.world;
  const { width, height } = Dimensions.get('window');

  const characterBody = useRef(
    Matter.Bodies.rectangle(
      width / 2,
      height / 2 + height * 0.1,
      SPRITE_SIZE,
      SPRITE_SIZE,
      {
        isStatic: true,
      }
    )
  ).current;

  useEffect(() => {
    Matter.World.add(world, [characterBody]);
    return () => {
      Matter.World.clear(world);
      Matter.Engine.clear(engine.current);
    };
  }, [world, characterBody]);

  const { exp, level, addExp, characterId, petName } = useCharacter();
  const { background } = useBackground();
  const sprite = CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES.GorillaM;
  const { addWorkout, liftCount } = useStats();
  const { enabled: notificationsEnabled, recordLiftTime } = useNotifications();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [startLevel, setStartLevel] = useState(level);

  useEffect(() => {
    if (!nameModalShown && (TEST_MODE || !petName) && !showNameModal) {
      setShowNameModal(true);
    }
  }, [petName, showNameModal, nameModalShown]);

  useEffect(() => {
    if (tutorialStep > 0) {
      arrowAnim.setValue(0);
      arrowLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, { toValue: -10, duration: 500, useNativeDriver: true }),
          Animated.timing(arrowAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      );
      arrowLoop.current.start();
    } else if (arrowLoop.current) {
      arrowLoop.current.stop();
    }
  }, [tutorialStep, arrowAnim]);

  useEffect(() => {
    if (!tutorialCompleted && !showNameModal && (TEST_MODE || !petName) && !showQuickWorkoutModal && tutorialStep === 0) {
      const timer = setTimeout(() => setShowQuickWorkoutModal(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [showNameModal, petName, showQuickWorkoutModal, tutorialStep, tutorialCompleted]);

  const showStats = useCallback(() => {
    setShowStatsModal(true);
  }, []);

  const handleNameModalClose = useCallback(() => {
    setShowNameModal(false);
    setNameModalShown(true);
  }, []);

  const handleLevelUpClose = useCallback(() => {
    setShowLevelUpModal(false);
    if (pendingAuthPrompt) {
      setShowAuthModal(true);
      setPendingAuthPrompt(false);
    }
  }, [pendingAuthPrompt]);

  const handleQuickWorkoutContinue = useCallback(() => {
    setShowQuickWorkoutModal(false);
    setTutorialStep(1);
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
    if (tutorialStep === 1) {
      setWorkoutName(`${petName}'s first lift!`);
    } else {
      setWorkoutName('');
    }
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
    if (tutorialStep === 1) {
      setTutorialStep(2);
    }
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

  const MAX_REPS = 100;
  const MAX_WEIGHT = 2000;

  const openNewExercise = idx => {
    setCurrentWorkoutIdx(idx);
    if (tutorialStep === 2) {
      setExerciseForm({ name: 'Bodyweight Pushups', sets: '1', reps: '5', weight: '0' });
      setTutorialStep(3);
    } else {
      setExerciseForm({ name: '', sets: '', reps: '', weight: '' });
    }
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
    let repsNum = parseInt(exerciseForm.reps, 10);
    if (Number.isNaN(repsNum)) repsNum = 0;
    if (repsNum > MAX_REPS) {
      repsNum = MAX_REPS;
      Alert.alert('Limit Reached', `Reps cannot exceed ${MAX_REPS}.`);
    }
    let weightNum = parseFloat(exerciseForm.weight);
    if (Number.isNaN(weightNum)) weightNum = 0;
    if (weightNum > MAX_WEIGHT) {
      weightNum = MAX_WEIGHT;
      Alert.alert('Limit Reached', `Weight cannot exceed ${MAX_WEIGHT}.`);
    }
    const ex = {
      ...exerciseForm,
      sets: String(setsNum),
      reps: String(repsNum),
      weight: String(weightNum),
    };
    let didAdd = false;
    setWorkouts(w => {
      const updated = [...w];
      const workout = { ...updated[currentWorkoutIdx] };
      const exercises = [...workout.exercises];
      if (editingExerciseIdx !== null) {
        exercises[editingExerciseIdx] = ex;
      } else {
        exercises.push(ex);
        didAdd = true;
      }
      workout.exercises = exercises;
      updated[currentWorkoutIdx] = workout;
      return updated;
    });
    if (didAdd && workoutActive) {
      setSetCounts(prev => [...prev, 0]);
    }
    setShowExerciseModal(false);
    if (tutorialStep === 3) {
      setTutorialStep(4);
    }
  };

  const handleDeleteExercise = () => {
    if (editingExerciseIdx === null) return;
    setWorkouts(w => {
      const updated = [...w];
      const workout = { ...updated[currentWorkoutIdx] };
      workout.exercises = workout.exercises.filter((_, i) => i !== editingExerciseIdx);
      updated[currentWorkoutIdx] = workout;
      return updated;
    });
    setShowExerciseModal(false);
  };
  const currentExercises = workouts[selectedWorkoutIdx]?.exercises ?? [];
  
const toggleWorkout = useCallback(() => {
  navigation.navigate('LiftMode');
}, [navigation]);

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

  const bgSource = background === 'oldschool' ? oldBG : newBG;

  return (
    <ImageBackground
      source={bgSource}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (deleteMode) setDeleteMode(false);
        }}
      >
      <View style={{flex: 1}} pointerEvents="box-none">
      <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
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
          <AvatarWithLevelBadge
            source={sprite}
            size={150}
            level={workoutActive ? null : level}
            rounded={false}
          />
        </TouchableOpacity>
        {!workoutActive && (
          <View style={styles.expBar}>
            <ExpBar exp={exp} />
          </View>
        )}
      </View>
      <View style={styles.gameContainer}>
        <GameEngine
          systems={[Physics, TouchHandler]}
          entities={entities}
          style={styles.engine}
          onEvent={onEvent}
        >
          <Character
            body={characterBody}
            sprite={sprite}
            petName={!workoutActive ? petName : ''}
          />
        </GameEngine>
      </View>
      {!workoutActive && (
        <EquipmentGrid exercises={currentExercises} showProgress={false} />
      )}

      {!workoutActive && (
        <>
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
        </>
      )}

      <TouchableOpacity
        style={[styles.workoutToggleBtn, workoutActive && styles.workoutToggleBtnActive]}
        onPress={toggleWorkout}
      >
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

      {tutorialStep > 0 && (
        <Animated.View style={[styles.arrow, arrowStyle, { transform: [{ translateY: arrowAnim }] }]}>
          <Ionicons name="arrow-down" size={tutorialStep === 3 ? 32 : 48} color="#fff" />
        </Animated.View>
      )}

      <QuickWorkoutModal
        visible={showQuickWorkoutModal}
        petName={petName}
        onClose={handleQuickWorkoutContinue}
      />

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
              onChangeText={t => {
                let num = parseInt(t, 10);
                if (!Number.isNaN(num)) {
                  if (num > MAX_REPS) {
                    num = MAX_REPS;
                    Alert.alert('Limit Reached', `Reps cannot exceed ${MAX_REPS}.`);
                  }
                  setExerciseForm({ ...exerciseForm, reps: String(num) });
                } else {
                  setExerciseForm({ ...exerciseForm, reps: t });
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={exerciseForm.weight}
              onChangeText={t => {
                let num = parseFloat(t);
                if (!Number.isNaN(num)) {
                  if (num > MAX_WEIGHT) {
                    num = MAX_WEIGHT;
                    Alert.alert('Limit Reached', `Weight cannot exceed ${MAX_WEIGHT}.`);
                  }
                  setExerciseForm({ ...exerciseForm, weight: String(num) });
                } else {
                  setExerciseForm({ ...exerciseForm, weight: t });
                }
              }}
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

      <NamePetModal
        visible={showNameModal}
        onClose={handleNameModalClose}
      />

      <LevelUpModal
        visible={showLevelUpModal}
        onClose={handleLevelUpClose}
        petName={petName}
      />

      {/* Stats Modal */}
      <Modal visible={showStatsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PokemonStatsCard />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SignInModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </SafeAreaView>
    </View>
    </TouchableWithoutFeedback>
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
    padding: -10,
    // Reduce bottom padding so the workout card takes less vertical space
    paddingBottom: 20,
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
    height: 190,
  },
  engine: {
    flex: 1,
  },
  character: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petName: {
    position: 'absolute',
    top: -20,
    fontWeight: '700',
    color: '#222',
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
  expBar: {
    marginTop: 8,
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
  workoutToggleBtnActive: {
    bottom: 24,
  },
  workoutToggleBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 21,
  },
  arrow: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
