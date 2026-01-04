/**
 * Authentication service
 * Handles Firebase Auth operations
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUser, getUser } from '../db/users';
import { User } from '../types';

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUser = userCredential.user;

  // Create user document in Firestore
  await createUser({
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
  });

  // Return user object
  const user = await getUser(firebaseUser.uid);
  if (!user) {
    throw new Error('Failed to create user document');
  }

  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const user = await getUser(firebaseUser.uid);
  if (!user) {
    throw new Error('User document not found');
  }

  return user;
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Get current Firebase auth user
 */
export function getCurrentAuthUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

