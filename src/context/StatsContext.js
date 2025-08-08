import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatsContext = createContext({
  weekWeight: 0,
  yearWeight: 0,
  liftCount: 0,
  addWorkout: (weight, hadSets) => {},
});

const STATS_KEY = 'userStats';

function getNextSundayReset(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (7 - day) % 7; // days until next Sunday
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 0, 0);
  return d.getTime();
}

function getNextYearReset(date = new Date()) {
  const d = new Date(date);
  const end = new Date(d.getFullYear(), 11, 31, 23, 59, 0, 0);
  if (d > end) end.setFullYear(d.getFullYear() + 1);
  return end.getTime();
}

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    weekWeight: 0,
    yearWeight: 0,
    liftCount: 0,
    weekReset: getNextSundayReset(),
    yearReset: getNextYearReset(),
  });

  // load saved stats
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STATS_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setStats(s => ({
            weekWeight: data.weekWeight || 0,
            yearWeight: data.yearWeight || 0,
            liftCount: data.liftCount || 0,
            weekReset: data.weekReset || getNextSundayReset(),
            yearReset: data.yearReset || getNextYearReset(),
          }));
        }
      } catch {}
    })();
  }, []);

  // persist stats whenever they change
  useEffect(() => {
    AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  const addWorkout = useCallback((weight, hadSets) => {
    setStats(prev => {
      const now = Date.now();
      let { weekWeight, yearWeight, liftCount, weekReset, yearReset } = prev;
      if (now >= weekReset) {
        weekWeight = 0;
        weekReset = getNextSundayReset(now);
      }
      if (now >= yearReset) {
        yearWeight = 0;
        yearReset = getNextYearReset(now);
      }
      if (weight > 0) {
        weekWeight += weight;
        yearWeight += weight;
      }
      if (hadSets) {
        liftCount = Math.min(liftCount + 1, 10000);
      }
      return { weekWeight, yearWeight, liftCount, weekReset, yearReset };
    });
  }, []);

  return (
    <StatsContext.Provider
      value={{
        weekWeight: stats.weekWeight,
        yearWeight: stats.yearWeight,
        liftCount: stats.liftCount,
        addWorkout,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
