import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InstallDateContext = createContext(new Date());

export const InstallDateProvider = ({ children }) => {
  const [installDate, setInstallDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('installDate');
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!Number.isNaN(parsed)) {
            setInstallDate(new Date(parsed));
            return;
          }
        }
        const now = Date.now();
        setInstallDate(new Date(now));
        await AsyncStorage.setItem('installDate', String(now));
      } catch {}
    })();
  }, []);

  return (
    <InstallDateContext.Provider value={installDate}>
      {children}
    </InstallDateContext.Provider>
  );
};

export const useInstallDate = () => useContext(InstallDateContext);
