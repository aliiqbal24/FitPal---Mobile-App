import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLevelInfo } from '../utils/levelUtils';
import { TEST_MODE } from '../utils/config';

const CharacterContext = createContext({
  exp: 0,
  level: 1,
  characterId: 'Gorilla1',
  petGender: 'Male',
  petName: '',
  setCharacterId: () => {},
  setPetGender: () => {},
  setPetName: () => {},
  addExp: () => {},
});

export const CharacterProvider = ({ children }) => {
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [characterId, setCharacterId] = useState('Gorilla1');
  const [petName, setPetName] = useState('');
  const [petGender, setPetGender] = useState('Male');

  // Load saved experience, character and pet name on mount
  useEffect(() => {
    (async () => {
      try {
        const hasSeenComic = await AsyncStorage.getItem('hasSeenComic');
        if (TEST_MODE || !hasSeenComic) {
          await AsyncStorage.setItem('exp', '0');
          setExp(0);
          setLevel(1);
        } else {
          const stored = await AsyncStorage.getItem('exp');
          if (stored != null) {
            const val = parseInt(stored, 10);
            if (!Number.isNaN(val)) {
              setExp(val);
              setLevel(getLevelInfo(val).level);
            }
          }
        }

        const char = await AsyncStorage.getItem('characterId');
        if (char) {
          setCharacterId(char);
        }
        const gender = await AsyncStorage.getItem('petGender');
        if (gender) {
          setPetGender(gender);
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

  // Persist pet gender
  useEffect(() => {
    AsyncStorage.setItem('petGender', petGender);
  }, [petGender]);

  // Persist pet name
  useEffect(() => {
    AsyncStorage.setItem('petName', petName);
  }, [petName]);

  const addExp = useCallback(amount => {
    setExp(e => e + amount);
  }, []);

  return (
    <CharacterContext.Provider
      value={{
        exp,
        level,
        characterId,
        petGender,
        petName,
        setCharacterId,
        setPetGender,
        setPetName,
        addExp,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);
