// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtkx_K1nbDCKD0itmrlPBrLm0tr1aAg1s",
  authDomain: "liftable-c57ad.firebaseapp.com",
  projectId: "liftable-c57ad",
  storageBucket: "liftable-c57ad.firebasestorage.app",
  messagingSenderId: "290700309837",
  appId: "1:290700309837:web:b19c3d3b3a320f97f9b304",
  measurementId: "G-FMV6MS1S70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});

const analytics = getAnalytics(app);
export const db = getFirestore(app);