import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
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

  const months = [generateMonth(selected.year, selected.month)];
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: false });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        contentContainerStyle={styles.monthScroll}
      >
        {months.map((m, idx) => (
          <View key={idx} style={[styles.monthContainer, { width: SCREEN_WIDTH }]}>
            <TouchableOpacity
              onPress={() => setShowPicker(prev => !prev)}
              style={styles.monthLabel}
            >
              <Text style={styles.monthLabelText}>
                {`${MONTH_NAMES[selected.month]} ${selected.year}`}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <Picker
                selectedValue={`${selected.year}-${selected.month}`}
                onValueChange={value => {
                  const [y, mo] = value.split('-').map(Number);
                  setSelected({ year: y, month: mo });
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
              {WEEK_DAYS.map(day => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.grid}>
              {m.days.map((day, i) => (
                <View key={i} style={styles.dayCell}>
                  {day && <Text style={styles.dayText}>{day}</Text>}
                  {selected.year === today.getFullYear() &&
                    selected.month === today.getMonth() &&
                    day === today.getDate() && (
                      <Image source={SPRITE} style={styles.sprite} />
                    )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>History coming soon.</Text>
      </View>
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
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
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
});
