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
    Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { User, DeviceToken } from '../types';

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

    // Parse deviceTokens if they exist
    const deviceTokens = data.deviceTokens ? {
        ios: data.deviceTokens.ios ? {
            token: data.deviceTokens.ios.token,
            updatedAt: data.deviceTokens.ios.updatedAt as Timestamp,
        } : undefined,
        android: data.deviceTokens.android ? {
            token: data.deviceTokens.android.token,
            updatedAt: data.deviceTokens.android.updatedAt as Timestamp,
        } : undefined,
    } : undefined;

    return {
        uid: docSnap.id,
        email: data.email,
        displayName: data.displayName,
        activeFamilyId: data.activeFamilyId,
        deviceTokens,
        deviceReady: data.deviceReady || false,
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
    console.log('[createUser] Creating user document', { uid: userData.uid, email: userData.email });
    
    try {
        const docRef = doc(firestore, COLLECTION, userData.uid);
        
        const userDocData = {
            email: userData.email,
            displayName: userData.displayName || null,
            activeFamilyId: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        
        console.log('[createUser] Document data prepared', userDocData);
        console.log('[createUser] Calling setDoc...');
        
        await setDoc(docRef, userDocData);
        
        console.log('[createUser] setDoc completed successfully');
        
        // Verify document was created
        const verifyDoc = await getDoc(docRef);
        if (verifyDoc.exists()) {
            console.log('[createUser] Document verified - exists in Firestore');
        } else {
            console.error('[createUser] ERROR: Document was not created despite setDoc success');
            throw new Error('Failed to create user document - verification failed');
        }
    } catch (error: any) {
        console.error('[createUser] ERROR creating user document:', error);
        console.error('[createUser] Error code:', error.code);
        console.error('[createUser] Error message:', error.message);
        throw error;
    }
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

