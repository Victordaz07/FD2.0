/**
 * Firebase configuration
 * IMPORTANT:
 * These values MUST exist at runtime.
 * If apiKey is undefined, Firebase Auth WILL FAIL.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Firebase configuration
 * Values can be overridden by environment variables if needed
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBqZSqW2ZU1EZldEuc0rktxMuSYi1hleq8",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "family-dash-15944.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "family-dash-15944",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "family-dash-15944.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "3950658017",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:3950658017:web:9d4d2ddea39f8a785e12a0",
};

// --- DEBUG (remove later if you want) ---
console.log("[Firebase] apiKey:", firebaseConfig.apiKey);
console.log("[Firebase] projectId:", firebaseConfig.projectId);
// ---------------------------------------

/**
 * Initialize Firebase App (singleton-safe)
 */
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

/**
 * Firebase Auth (React Native persistence)
 */
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

/**
 * Firestore & Storage
 */
const firestore = getFirestore(app);
const db = firestore; // Alias for compatibility
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, firestore, db, storage, functions };

