/**
 * Device token registration for push notifications
 * Handles Expo push tokens and stores them in Firestore
 * Gracefully handles Expo Go limitations
 */

import { Platform } from 'react-native';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Lazy import to avoid errors during module loading in Expo Go
let Notifications: any = null;
let notificationsInitialized = false;

/**
 * Safely initialize notifications module
 * Returns null if not available (e.g., Expo Go)
 */
async function getNotifications(): Promise<typeof import('expo-notifications') | null> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:20',message:'getNotifications called',data:{notificationsInitialized},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  if (notificationsInitialized) {
    return Notifications;
  }

  try {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:28',message:'Attempting to import expo-notifications',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    Notifications = await import('expo-notifications');
    notificationsInitialized = true;
    
    // Configure notification behavior
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:42',message:'setNotificationHandler succeeded',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:45',message:'setNotificationHandler failed',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.warn('Failed to set notification handler:', error);
    }
    
    return Notifications;
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:51',message:'Failed to import expo-notifications',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    console.warn('expo-notifications not available (likely Expo Go limitation):', error);
    notificationsInitialized = true; // Mark as initialized to avoid retrying
    return null;
  }
}

/**
 * Create Android notification channel (call this on app start)
 * Silently fails if not available (e.g., in Expo Go)
 */
export async function createNotificationChannel(): Promise<void> {
  try {
    const NotificationsModule = await getNotifications();
    if (!NotificationsModule) {
      return; // Notifications not available
    }
    
    if (Platform.OS === 'android') {
      await NotificationsModule.setNotificationChannelAsync('attention_high', {
        name: 'Attention Ring',
        importance: NotificationsModule.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    }
  } catch (error: any) {
    console.warn('Failed to create notification channel (may be Expo Go limitation):', error);
    // Don't throw - allow app to continue
  }
}

/**
 * Request permissions and get push token
 */
export async function getPushToken(): Promise<string | null> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:95',message:'getPushToken called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  try {
    const NotificationsModule = await getNotifications();
    if (!NotificationsModule) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:100',message:'Notifications module not available',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return null; // Notifications not available (Expo Go)
    }

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:105',message:'Before getPermissionsAsync',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const { status: existingStatus } = await NotificationsModule.getPermissionsAsync();
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:108',message:'After getPermissionsAsync',data:{existingStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await NotificationsModule.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:117',message:'Permissions not granted',data:{finalStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.warn('Push notification permissions not granted');
      return null;
    }

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:123',message:'Before getExpoPushTokenAsync',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const tokenData = await NotificationsModule.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:127',message:'After getExpoPushTokenAsync - success',data:{hasToken:!!tokenData?.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    return tokenData.data;
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:132',message:'getPushToken error caught',data:{error:error?.message,errorCode:error?.code,errorName:error?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.warn('Error getting push token (may be Expo Go limitation):', error);
    return null;
  }
}

/**
 * Register device token for current user
 * Updates users/{uid} with device token
 * Silently fails if token cannot be obtained (e.g., in Expo Go)
 */
export async function registerDeviceToken(uid: string): Promise<void> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:107',message:'registerDeviceToken called',data:{uid},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  try {
    const token = await getPushToken();
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:111',message:'After getPushToken',data:{hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (!token) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:114',message:'No token - returning silently (Expo Go limitation)',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.warn('Cannot register device token: push notifications not available (likely Expo Go limitation)');
      return; // Silently return instead of throwing
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:128',message:'registerDeviceToken completed successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'registerDevice.ts:131',message:'registerDeviceToken error caught',data:{error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.warn('Failed to register device token (may be Expo Go limitation):', error);
    // Don't throw - allow app to continue
  }
}

/**
 * Update device token if it changes (call this periodically or on token refresh)
 */
export async function refreshDeviceToken(uid: string): Promise<void> {
  await registerDeviceToken(uid);
}

