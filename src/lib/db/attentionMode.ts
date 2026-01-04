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

const MEMBERS_COLLECTION = (familyId: string) => `families/${familyId}/members`;

/**
 * Get attention mode for a member
 */
export async function getAttentionMode(
  familyId: string,
  memberUid: string
): Promise<AttentionMode | null> {
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

  return {
    enabled: attentionMode.enabled,
    allowLoud: attentionMode.allowLoud,
    forcedUntil: attentionMode.forcedUntil ? (attentionMode.forcedUntil as Timestamp) : undefined,
    updatedAt: attentionMode.updatedAt as Timestamp,
    updatedByUid: attentionMode.updatedByUid,
  };
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
    updateData['attentionMode.enabled'] = updates.enabled;
  }

  if (updates.allowLoud !== undefined) {
    updateData['attentionMode.allowLoud'] = updates.allowLoud;
  }

  await updateDoc(docRef, updateData);
}

