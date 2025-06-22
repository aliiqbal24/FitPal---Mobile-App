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
          setHistory(JSON.parse(stored));
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('workoutHistory', JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((dateStr, workout) => {
    setHistory(h => ({ ...h, [dateStr]: workout }));
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addEntry }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
