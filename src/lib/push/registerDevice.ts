/**
 * Device token registration for push notifications
 * Handles Expo push tokens and stores them in Firestore
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase/config';

/**
 * Configure notification behavior
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Create Android notification channel (call this on app start)
 */
export async function createNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('attention_high', {
      name: 'Attention Ring',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });
  }
}

/**
 * Request permissions and get push token
 */
export async function getPushToken(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permissions not granted');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    });

    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Register device token for current user
 * Updates users/{uid} with device token
 */
export async function registerDeviceToken(uid: string): Promise<void> {
  const token = await getPushToken();
  if (!token) {
    throw new Error('No se pudo obtener el token de notificaciones');
  }

  const userRef = doc(firestore, 'users', uid);
  const platformKey = Platform.OS === 'ios' ? 'ios' : 'android';

  await updateDoc(userRef, {
    [`deviceTokens.${platformKey}`]: {
      token,
      updatedAt: serverTimestamp(),
    },
    deviceReady: true,
  });
}

/**
 * Update device token if it changes (call this periodically or on token refresh)
 */
export async function refreshDeviceToken(uid: string): Promise<void> {
  await registerDeviceToken(uid);
}

