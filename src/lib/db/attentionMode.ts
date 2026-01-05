/**
 * Attention Mode data access layer
 * AttentionMode is stored in families/{familyId}/members/{uid}
 * NO direct Firestore access from UI - use these functions
 */

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { AttentionMode } from '../types';
import { toBool } from '../helpers/booleanHelpers';

const MEMBERS_COLLECTION = (familyId: string) => `families/${familyId}/members`;

/**
 * Get attention mode for a member
 * Returns null if not found, or a safe AttentionMode object with guaranteed boolean values
 * 
 * TEMPORARILY DISABLED - Returns null to avoid crashes while fixing boolean casting issues
 */
export async function getAttentionMode(
  familyId: string,
  memberUid: string
): Promise<AttentionMode | null> {
  // TEMPORARILY DISABLED - Return null to prevent crashes
  // TODO: Re-enable once boolean casting issues are resolved
  return null;

  /* ORIGINAL CODE - COMMENTED OUT TEMPORARILY
  try {
    const docRef = doc(firestore, MEMBERS_COLLECTION(familyId), memberUid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const attentionMode = data.attentionMode;

    if (!attentionMode) {
      return null;
    }

    // Force boolean conversion with fallback to false - handles any corrupted data
    // This ensures we NEVER return a string or any non-boolean value
    const normalizedEnabled = typeof attentionMode.enabled === 'boolean' 
      ? attentionMode.enabled 
      : toBool(attentionMode.enabled, false);
    
    const normalizedAllowLoud = typeof attentionMode.allowLoud === 'boolean'
      ? attentionMode.allowLoud
      : toBool(attentionMode.allowLoud, false);

    // Validate Timestamp fields safely
    const forcedUntil = attentionMode.forcedUntil && attentionMode.forcedUntil instanceof Timestamp
      ? attentionMode.forcedUntil
      : undefined;
    
    const updatedAt = attentionMode.updatedAt && attentionMode.updatedAt instanceof Timestamp
      ? attentionMode.updatedAt
      : Timestamp.now(); // Fallback to now if missing
    
    const updatedByUid = typeof attentionMode.updatedByUid === 'string'
      ? attentionMode.updatedByUid
      : memberUid; // Fallback to memberUid if missing

    return {
      // GUARANTEED to be boolean - never string or any other type
      enabled: Boolean(normalizedEnabled),
      allowLoud: Boolean(normalizedAllowLoud),
      forcedUntil,
      updatedAt,
      updatedByUid,
    };
  } catch (error) {
    // If anything goes wrong, return null instead of crashing
    console.error('Error loading attention mode:', error);
    return null;
  }
  */
}

/**
 * Update attention mode (client-side, for self only)
 * NOTE: This should typically be called via Function setAttentionMode for audit logs
 * But we keep this for flexibility - Firestore Rules enforce self-only writes
 */
export async function updateAttentionMode(
  familyId: string,
  memberUid: string,
  updates: {
    enabled?: boolean;
    allowLoud?: boolean;
  },
  updatedByUid: string
): Promise<void> {
  const docRef = doc(firestore, MEMBERS_COLLECTION(familyId), memberUid);

  const updateData: any = {
    'attentionMode.updatedAt': serverTimestamp(),
    'attentionMode.updatedByUid': updatedByUid,
  };

  if (updates.enabled !== undefined) {
    // Force boolean - never store strings (handles string "false" correctly)
    updateData['attentionMode.enabled'] = toBool(updates.enabled);
  }

  if (updates.allowLoud !== undefined) {
    // Force boolean - never store strings (handles string "false" correctly)
    updateData['attentionMode.allowLoud'] = toBool(updates.allowLoud);
  }

  await updateDoc(docRef, updateData);
}

