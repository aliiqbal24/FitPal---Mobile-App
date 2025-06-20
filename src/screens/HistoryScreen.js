import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPRITE = require('../../assets/AppSprite.png');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 32) / 7);

function generateMonth(offset = 0) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(1);
  base.setMonth(base.getMonth() + offset);
  const year = base.getFullYear();
  const month = base.getMonth();
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
  const months = [generateMonth(-1), generateMonth(0)];
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
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[m.month]} {m.year}
            </Text>
            <View style={styles.weekHeader}>
              {WEEK_DAYS.map(day => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.grid}>
              {m.days.map((day, i) => (
                <View key={i} style={styles.dayCell}>
                  {day && <Text style={styles.dayText}>{day}</Text>}
                  {idx === months.length - 1 && day === today.getDate() && (
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
  monthTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
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
