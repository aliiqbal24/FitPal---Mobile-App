import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CharacterContext = createContext({
  exp: 0,
  level: 1,
  addExp: () => {},
});

export const CharacterProvider = ({ children }) => {
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);

  // Load saved experience on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('exp');
        if (stored != null) {
          const val = parseInt(stored, 10);
          if (!Number.isNaN(val)) {
            setExp(val);
            setLevel(Math.floor(val / 20) + 1);
          }
        }
      } catch {}
    })();
  }, []);

  // Persist experience and update level when EXP changes
  useEffect(() => {
    AsyncStorage.setItem('exp', String(exp));
    const newLevel = Math.floor(exp / 20) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [exp, level]);

  const addExp = useCallback(amount => {
    setExp(e => e + amount);
  }, []);

  return (
    <CharacterContext.Provider value={{ exp, level, addExp }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);
