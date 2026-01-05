/**
 * Type declaration for Firebase Auth React Native persistence
 * This is needed because getReactNativePersistence exists at runtime
 * but is not included in the TypeScript definitions for firebase/auth
 */

import { Persistence } from 'firebase/auth';
import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: AsyncStorageStatic
  ): Persistence;
}

