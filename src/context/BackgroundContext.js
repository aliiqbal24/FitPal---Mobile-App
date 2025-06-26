import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackgroundContext = createContext({
  background: 'newschool',
  setBackground: () => {},
});

export const BackgroundProvider = ({ children }) => {
  const [background, setBackground] = useState('newschool');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('background');
        if (stored) {
          setBackground(stored);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('background', background);
  }, [background]);

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
