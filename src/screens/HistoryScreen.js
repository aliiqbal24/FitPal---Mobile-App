import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPRITE = require('../../assets/AppSprite.png');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function HistoryScreen() {
  const today = new Date();

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
  const [history, setHistory] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [weekWeight, setWeekWeight] = useState(0);
  const [yearWeight, setYearWeight] = useState(0);
  const [liftCount, setLiftCount] = useState(0);

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

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      (async () => {
        const stored = await AsyncStorage.getItem("workoutHistory");
        if (stored && mounted) {
          try {
            setHistory(JSON.parse(stored));
          } catch {}
        }
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  useEffect(() => {
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    let week = 0;
    let year = 0;
    let count = 0;
    Object.entries(history).forEach(([dateStr, data]) => {
      const dt = new Date(dateStr);
      let weight = 0;
      data.exercises.forEach((ex, idx) => {
        const setsDone =
          data.completedSets && data.completedSets[idx] !== undefined
            ? data.completedSets[idx]
            : parseInt(ex.sets, 10) || 0;
        const reps = parseInt(ex.reps, 10) || 0;
        const w = parseFloat(ex.weight) || 0;
        weight += setsDone * reps * w;
      });
      if (dt >= startOfWeek) week += weight;
      if (dt >= startOfYear) year += weight;
      count += 1;
    });
    setWeekWeight(week);
    setYearWeight(year);
    setLiftCount(count);
  }, [history]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onMomentumScrollEnd={handleMomentumScrollEnd}
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
                const completed = !!(dateStr && history[dateStr]);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dayCell, completed && styles.completedDay]}
                    onPress={() => completed && setSelectedEntry(history[dateStr])}
                    disabled={!completed}
                  >
                    {day && <Text style={styles.dayText}>{day}</Text>}
                    {m.year === today.getFullYear() &&
                      m.month === today.getMonth() &&
                      day === today.getDate() && (
                        <Image source={SPRITE} style={styles.sprite} />
                      )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Weight lifted this week: {weekWeight}</Text>
        <Text style={styles.statsText}>Weight lifted this year: {yearWeight}</Text>
        <Text style={styles.statsText}>Lifts since download: {liftCount}</Text>
      </View>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tap a green date to view details.</Text>
      </View>

      {selectedEntry && (
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedEntry.name}</Text>
              {selectedEntry.exercises?.map((ex, idx) => {
                const setsDone =
                  selectedEntry.completedSets &&
                  selectedEntry.completedSets[idx] !== undefined
                    ? selectedEntry.completedSets[idx]
                    : ex.sets;
                return (
                  <Text key={idx} style={styles.modalText}>
                    {ex.name} - {setsDone}x{ex.reps} @ {ex.weight}
                  </Text>
                );
              })}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setSelectedEntry(null)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
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
  monthScroll: {
    alignItems: 'flex-start',
  },
  monthContainer: {
    paddingTop: 8,
  },
  monthLabel: {
    alignSelf: 'center',
    marginBottom: 4,
  },
  monthLabelText: {
    fontSize: 16,
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
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsText: {
    fontWeight: '600',
    color: '#222',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalText: {
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
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
