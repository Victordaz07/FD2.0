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
  console.log('[AuthService] signUp called', { email, displayName });
  
  try {
    console.log('[AuthService] Calling Firebase createUserWithEmailAndPassword...');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log('[AuthService] Firebase signUp successful', { uid: userCredential.user.uid });
    
    const firebaseUser = userCredential.user;

    // Wait a bit for auth state to propagate
    console.log('[AuthService] Waiting for auth state to sync...');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create user document in Firestore
    console.log('[AuthService] Creating user document in Firestore...');
    try {
      await createUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
      });
      console.log('[AuthService] User document created successfully');
    } catch (createError: any) {
      console.error('[AuthService] ERROR creating user document:', createError);
      // If document creation fails, we should still allow the user to proceed
      // but log the error. They can complete registration later.
      if (createError.code === 'permission-denied') {
        throw new Error('Error de permisos al crear el perfil. Intenta nuevamente.');
      }
      throw createError;
    }

    // Return user object
    console.log('[AuthService] Getting user document from Firestore...');
    const user = await getUser(firebaseUser.uid);
    if (!user) {
      console.error('[AuthService] Failed to retrieve user document after creation');
      throw new Error('Failed to create user document');
    }

    console.log('[AuthService] User document retrieved', { uid: user.uid });
    return user;
  } catch (error: any) {
    console.error('[AuthService] signUp error:', error);
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string
): Promise<User> {
  console.log('[AuthService] signIn called', { email });
  
  try {
    console.log('[AuthService] Calling Firebase signInWithEmailAndPassword...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('[AuthService] Firebase signIn successful', { uid: userCredential.user.uid });
    
    const firebaseUser = userCredential.user;

    console.log('[AuthService] Getting user document from Firestore...');
    const user = await getUser(firebaseUser.uid);
    if (!user) {
      console.error('[AuthService] User document not found');
      throw new Error('User document not found');
    }

    console.log('[AuthService] User document retrieved', { uid: user.uid });
    return user;
  } catch (error: any) {
    console.error('[AuthService] signIn error:', error);
    throw error;
  }
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


