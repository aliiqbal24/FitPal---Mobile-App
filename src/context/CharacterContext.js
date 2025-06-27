import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLevelInfo } from '../utils/levelUtils';

const CharacterContext = createContext({
  exp: 0,
  level: 1,
  characterId: 'GorillaM',
  petName: '',
  setCharacterId: () => {},
  setPetName: () => {},
  addExp: () => {},
});

export const CharacterProvider = ({ children }) => {
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [characterId, setCharacterId] = useState('GorillaM');
  const [petName, setPetName] = useState('');

  // Load saved experience, character and pet name on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('exp');
        if (stored != null) {
          const val = parseInt(stored, 10);
          if (!Number.isNaN(val)) {
            setExp(val);
            setLevel(getLevelInfo(val).level);
          }
        }
        const char = await AsyncStorage.getItem('characterId');
        if (char) {
          setCharacterId(char);
        }
        const name = await AsyncStorage.getItem('petName');
        if (name) {
          setPetName(name);
        }
      } catch {}
    })();
  }, []);

  // Persist experience and update level when EXP changes
  useEffect(() => {
    AsyncStorage.setItem('exp', String(exp));
    const newLevel = getLevelInfo(exp).level;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [exp, level]);

  // Persist character selection
  useEffect(() => {
    AsyncStorage.setItem('characterId', characterId);
  }, [characterId]);

  // Persist pet name
  useEffect(() => {
    AsyncStorage.setItem('petName', petName);
  }, [petName]);

  const addExp = useCallback(amount => {
    setExp(e => e + amount);
  }, []);

  return (
    <CharacterContext.Provider
      value={{ exp, level, characterId, petName, setCharacterId, setPetName, addExp }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);
