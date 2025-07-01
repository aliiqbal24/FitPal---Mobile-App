// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCtkx_K1nbDCKD0itmrlPBrLm0tr1aAg1s',
  authDomain: 'liftable-c57ad.firebaseapp.com',
  projectId: 'liftable-c57ad',
  storageBucket: 'liftable-c57ad.firebasestorage.app',
  messagingSenderId: '290700309837',
  appId: '1:290700309837:web:b19c3d3b3a320f97f9b304',
  measurementId: 'G-FMV6MS1S70',
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const analytics = getAnalytics(app);
