import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCharacter } from './CharacterContext';

const NotificationContext = createContext({
  enabled: false,
  setEnabled: () => {},
  recordLiftTime: () => {},
});

const ENABLED_KEY = 'workoutNotificationsEnabled';
const LAST_LIFT_KEY = 'lastLiftTimestamp';
const SIXTEEN_HOURS_MS = 16 * 60 * 60 * 1000;

export const NotificationProvider = ({ children }) => {
  const { petName } = useCharacter();
  const [enabled, setEnabledState] = useState(false);
  const [lastLiftTime, setLastLiftTime] = useState(null);

  useEffect(() => {
    (async () => {
      const storedEnabled = await AsyncStorage.getItem(ENABLED_KEY);
      const storedTime = await AsyncStorage.getItem(LAST_LIFT_KEY);
      if (storedEnabled === 'true') setEnabledState(true);
      if (storedTime) {
        const t = parseInt(storedTime, 10);
        if (!Number.isNaN(t)) setLastLiftTime(t);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false');
  }, [enabled]);

  useEffect(() => {
    if (lastLiftTime != null) {
      AsyncStorage.setItem(LAST_LIFT_KEY, String(lastLiftTime));
    }
  }, [lastLiftTime]);

  const requestPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const res = await Notifications.requestPermissionsAsync();
      return res.status === 'granted';
    }
    return true;
  };

  const scheduleReminder = useCallback(
    async (time) => {
      if (!enabled) return;
      const granted = await requestPermission();
      if (!granted) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${petName || 'Your buddy'} misses you`,
          body: 'Hit a lift?',
        },
        trigger: { date: new Date(time + SIXTEEN_HOURS_MS) },
      });
    },
    [enabled, petName]
  );

  const recordLiftTime = useCallback(
    async (time) => {
      setLastLiftTime(time);
      if (enabled) {
        await scheduleReminder(time);
      }
    },
    [enabled, scheduleReminder]
  );

  const setEnabled = useCallback(
    async (val) => {
      setEnabledState(val);
      if (!val) {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } else if (lastLiftTime != null) {
        await scheduleReminder(lastLiftTime);
      }
    },
    [lastLiftTime, scheduleReminder]
  );

  return (
    <NotificationContext.Provider value={{ enabled, setEnabled, recordLiftTime }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
