// firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCtkx_K1nbDCKD0itmrlPBrLm0tr1aAg1s',
  authDomain: 'liftable-c57ad.firebaseapp.com',
  projectId: 'liftable-c57ad',
  storageBucket: 'liftable-c57ad.appspot.com', // ✅ Fixed
  messagingSenderId: '290700309837',
  appId: '1:290700309837:web:b19c3d3b3a320f97f9b304',
  measurementId: 'G-FMV6MS1S70',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
