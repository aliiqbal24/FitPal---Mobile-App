import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext({
  history: {},
  addEntry: (dateStr, workout) => {},
});

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('workoutHistory');
        if (stored) {
          const data = JSON.parse(stored);
          const normalized = Object.fromEntries(
            Object.entries(data).map(([date, entry]) => [
              date,
              Array.isArray(entry) ? entry : [entry],
            ])
          );
          setHistory(normalized);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('workoutHistory', JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((dateStr, workout) => {
    setHistory(h => {
      const dayEntries = h[dateStr] ? [...h[dateStr]] : [];
      dayEntries.push(workout);
      if (dayEntries.length > 3) {
        dayEntries.shift();
      }
      return { ...h, [dateStr]: dayEntries };
    });
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addEntry }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
