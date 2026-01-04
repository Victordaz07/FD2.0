/**
 * User data access layer
 * NO direct Firestore access from UI - use these functions
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { User } from '../types';

const COLLECTION = 'users';

/**
 * Get user by UID
 */
export async function getUser(uid: string): Promise<User | null> {
  const docRef = doc(firestore, COLLECTION, uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    uid: docSnap.id,
    email: data.email,
    displayName: data.displayName,
    activeFamilyId: data.activeFamilyId,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Create user document
 */
export async function createUser(userData: {
  uid: string;
  email: string;
  displayName?: string;
}): Promise<void> {
  const docRef = doc(firestore, COLLECTION, userData.uid);
  await setDoc(docRef, {
    email: userData.email,
    displayName: userData.displayName || null,
    activeFamilyId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update user's active family ID
 */
export async function updateUserActiveFamily(
  uid: string,
  familyId: string | null
): Promise<void> {
  const docRef = doc(firestore, COLLECTION, uid);
  await updateDoc(docRef, {
    activeFamilyId: familyId,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<User, 'displayName'>>
): Promise<void> {
  const docRef = doc(firestore, COLLECTION, uid);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

