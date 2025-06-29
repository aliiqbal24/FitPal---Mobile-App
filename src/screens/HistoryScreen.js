import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Modal, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHistory } from '../context/HistoryContext';
import { useStats } from '../context/StatsContext';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatWeight } from '../utils/numberUtils';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTER_IMAGES } from '../data/characters';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CALENDAR_OFFSET = SCREEN_HEIGHT * 0.05;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 32) / 7);

function generateMonth(year, month) {
  const base = new Date(year, month, 1);
  base.setHours(0, 0, 0, 0);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return { year, month, days };
}


export default function HistoryScreen({ setSwipeEnabled }) {
  const today = new Date();

  const { characterId } = useCharacter();
  const sprite = CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES.GorillaM;

  // Build the list of selectable months from April 2025 to today
  const earliest = new Date(2025, 3, 1); // April 2025
  const monthOptions = [];
  const iter = new Date(earliest.getTime());
  while (iter <= today) {
    monthOptions.push({ year: iter.getFullYear(), month: iter.getMonth() });
    iter.setMonth(iter.getMonth() + 1);
  }

  const [selected, setSelected] = useState(
    monthOptions[monthOptions.length - 1]
  );
  const [showPicker, setShowPicker] = useState(false);
  const { history } = useHistory();
  const { weekWeight, yearWeight, liftCount } = useStats();
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Pre-compute all months so users can swipe between them
  const months = monthOptions.map(opt => generateMonth(opt.year, opt.month));
  const scrollRef = useRef(null);

  // Jump to the initially selected month (latest)
  useEffect(() => {
    if (scrollRef.current) {
      const index = monthOptions.findIndex(
        opt => opt.year === selected.year && opt.month === selected.month
      );
      scrollRef.current.scrollTo({ x: index * SCREEN_WIDTH, animated: false });
    }
  }, []);

  const handleMomentumScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const opt = monthOptions[index];
    if (opt) {
      setSelected({ year: opt.year, month: opt.month });
    }
  };

  const shareStats = async () => {
    try {
      await Share.share({
        message: `I've lifted ${weekWeight} this week and ${yearWeight} this year with ${liftCount} total lifts!`,
      });
    } catch (e) {
      // ignore share errors
    }
  };

  useEffect(() => {
    return () => setSwipeEnabled(true);
  }, [setSwipeEnabled]);



  return (
    <SafeAreaView edges={['left','right','bottom']} style={styles.container}>
      <ScrollView
        style={styles.calendarWrapper}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onScrollBeginDrag={() => setSwipeEnabled(false)}
        onMomentumScrollEnd={e => {
          handleMomentumScrollEnd(e);
          setSwipeEnabled(true);
        }}
        contentContainerStyle={styles.monthScroll}
      >
        {months.map((m, idx) => (
          <View key={idx} style={[styles.monthContainer, { width: SCREEN_WIDTH }]}>
            <TouchableOpacity
              onPress={() => setShowPicker(prev => !prev)}
              style={styles.monthLabel}
            >
              <Text style={styles.monthLabelText}>
                {`${MONTH_NAMES[m.month]} ${m.year}`}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <Picker
                selectedValue={`${selected.year}-${selected.month}`}
                onValueChange={value => {
                  const [y, mo] = value.split('-').map(Number);
                  const idx = monthOptions.findIndex(
                    opt => opt.year === y && opt.month === mo
                  );
                  setSelected({ year: y, month: mo });
                  if (scrollRef.current && idx !== -1) {
                    scrollRef.current.scrollTo({
                      x: idx * SCREEN_WIDTH,
                      animated: true,
                    });
                  }
                  setShowPicker(false);
                }}
                style={styles.monthPicker}
              >
                {monthOptions.map(opt => (
                  <Picker.Item
                    label={`${MONTH_NAMES[opt.month]} ${opt.year}`}
                    value={`${opt.year}-${opt.month}`}
                    key={`${opt.year}-${opt.month}`}
                  />
                ))}
              </Picker>
            )}
            <View style={styles.weekHeader}>
              {WEEK_DAYS.map((day, i) => (
                <Text key={`${day}-${i}`} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.grid}>
              {m.days.map((day, i) => {
                const dateStr = day
                  ? `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : null;
                const completed = !!(dateStr && history[dateStr] && history[dateStr].length);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dayCell, completed && styles.completedDay]}
                    onPress={() =>
                      completed &&
                      setSelectedEntry({ workouts: history[dateStr] })
                    }
                    disabled={!completed}
                  >
                    {day && <Text style={styles.dayText}>{day}</Text>}
                    {m.year === today.getFullYear() &&
                      m.month === today.getMonth() &&
                      day === today.getDate() && (
                        <Image source={sprite} style={styles.sprite} />
                      )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.statsWrapper}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Weight lifted this week: {formatWeight(weekWeight)}</Text>
          <Text style={styles.statsText}>Weight lifted this year: {formatWeight(yearWeight)}</Text>
          <Text style={styles.statsText}>Lifts since download: {liftCount}</Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={shareStats}>
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tap a green date to view details.</Text>
      </View>

      {selectedEntry && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {selectedEntry.workouts.map((w, wi) => (
                  <View key={wi} style={styles.workoutSection}>
                    <Text style={styles.modalSubtitle}>{w.name}</Text>
                    {w.exercises?.map((ex, idx) => {
                      const setsDone =
                        w.completedSets && w.completedSets[idx] !== undefined
                          ? w.completedSets[idx]
                          : 0;
                      return (
                        <Text key={idx} style={styles.modalText}>
                          {ex.name} - {setsDone}x{ex.reps} @ {ex.weight}
                        </Text>
                      );
                    })}
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setSelectedEntry(null)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarWrapper: {
    marginTop: 0.2 * CALENDAR_OFFSET,
  },
  monthScroll: {
    alignItems: 'flex-start',
  },
  monthContainer: {
    paddingTop: 8,
  },
  monthLabel: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  monthLabelText: {
    fontSize: 18,
    fontWeight: '600',
  },
  monthPicker: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.6,
    marginBottom: 8,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  weekDay: {
    width: CELL_SIZE,
    textAlign: 'center',
    color: '#666',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statsText: {
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
  },
  shareBtn: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  completedDay: {
    backgroundColor: '#b3e5c0',
  },
  dayText: {
    fontSize: 14,
    color: '#222',
  },
  sprite: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    resizeMode: 'contain',
  },
  placeholder: {
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#888',
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
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
    textAlign: 'center',
  },
  modalText: {
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  workoutSection: {
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
