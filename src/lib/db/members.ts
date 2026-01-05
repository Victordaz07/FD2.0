/**
 * Family Members data access layer
 * NO direct Firestore access from UI - use these functions
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { FamilyMember, Role } from '../types';
import { computeAgeGroup } from '../policy/agePolicy';
import { toBool } from '../helpers/booleanHelpers';
import { getFamily } from './families';

const COLLECTION = (familyId: string) => `families/${familyId}/members`;

/**
 * Get member by UID in a family
 */
export async function getMember(
  familyId: string,
  uid: string
): Promise<FamilyMember | null> {
  const docRef = doc(firestore, COLLECTION(familyId), uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    uid: docSnap.id,
    familyId,
    role: data.role,
    displayName: data.displayName || undefined,
    birthYear: data.birthYear,
    ageGroup: data.ageGroup,
    // Force boolean conversion - Firestore may have stored strings
    isMinor: toBool(data.isMinor),
    // TEMPORARILY DISABLED - Remove attentionMode to prevent crashes
    // TODO: Re-enable once boolean casting issues are resolved
    attentionMode: undefined,
    /* ORIGINAL CODE - COMMENTED OUT TEMPORARILY
    attentionMode: data.attentionMode
      ? {
        // Force boolean conversion - Firestore may have stored strings
        // Double conversion ensures we NEVER pass non-boolean to components
        enabled: Boolean(toBool(data.attentionMode.enabled, false)),
        allowLoud: Boolean(toBool(data.attentionMode.allowLoud, false)),
        forcedUntil: data.attentionMode.forcedUntil ? data.attentionMode.forcedUntil.toDate() : undefined,
        updatedAt: data.attentionMode.updatedAt.toDate(),
        updatedByUid: data.attentionMode.updatedByUid,
      }
      : undefined,
    */
    transition: data.transition
      ? {
        ...data.transition,
        eligibleAt: data.transition.eligibleAt?.toDate(),
        promotedAt: data.transition.promotedAt?.toDate(),
      }
      : undefined,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    createdBy: data.createdBy,
  };
}

/**
 * Get all members of a family
 */
export async function getFamilyMembers(
  familyId: string
): Promise<FamilyMember[]> {
  const q = query(collection(firestore, COLLECTION(familyId)));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // #region agent log
    const rawEnabled = data.attentionMode?.enabled;
    const rawAllowLoud = data.attentionMode?.allowLoud;
    fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'members.ts:82', message: 'getFamilyMembers - raw Firestore data', data: { uid: doc.id, rawEnabledType: typeof rawEnabled, rawEnabledValue: rawEnabled, rawAllowLoudType: typeof rawAllowLoud, rawAllowLoudValue: rawAllowLoud }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion
    return {
      uid: doc.id,
      familyId,
      role: data.role,
      displayName: data.displayName || undefined,
      birthYear: data.birthYear,
      ageGroup: data.ageGroup,
      // Force boolean conversion - Firestore may have stored strings
      isMinor: toBool(data.isMinor),
      // TEMPORARILY DISABLED - Remove attentionMode to prevent crashes
      // TODO: Re-enable once boolean casting issues are resolved
      attentionMode: undefined,
      /* ORIGINAL CODE - COMMENTED OUT TEMPORARILY
      attentionMode: data.attentionMode
        ? {
          // Force boolean conversion - Firestore may have stored strings
          // Double conversion ensures we NEVER pass non-boolean to components
          enabled: Boolean(toBool(data.attentionMode.enabled, false)),
          allowLoud: Boolean(toBool(data.attentionMode.allowLoud, false)),
          forcedUntil: data.attentionMode.forcedUntil ? data.attentionMode.forcedUntil.toDate() : undefined,
          updatedAt: data.attentionMode.updatedAt.toDate(),
          updatedByUid: data.attentionMode.updatedByUid,
        }
        : undefined,
      */
      transition: data.transition
        ? {
          ...data.transition,
          eligibleAt: data.transition.eligibleAt?.toDate(),
          promotedAt: data.transition.promotedAt?.toDate(),
        }
        : undefined,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      createdBy: data.createdBy,
    };
  });
}

/**
 * Add member to family
 */
export async function addMember(data: {
  familyId: string;
  uid: string;
  role: Role;
  createdBy: string;
  displayName?: string;
  birthYear?: number;
}): Promise<void> {
  const family = await getFamily(data.familyId);
  if (!family) {
    throw new Error('Family not found');
  }

  // Compute age group if birthYear is provided
  const ageGroup = computeAgeGroup(data.birthYear, family.familyPolicy);
  const isMinor = ageGroup === 'CHILD' || ageGroup === 'TEEN';

  const docRef = doc(firestore, COLLECTION(data.familyId), data.uid);
  await setDoc(docRef, {
    role: data.role,
    displayName: data.displayName || null,
    birthYear: data.birthYear || null,
    ageGroup: ageGroup || null,
    isMinor: isMinor,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: data.createdBy,
  });
}

/**
 * Update member role (DEPRECATED)
 * @deprecated Use changeMemberRole from @/lib/functions instead
 * This function is kept for backward compatibility but should not be used.
 * Use the callable function changeMemberRole which includes validation and audit logs.
 */
export async function updateMemberRole(
  familyId: string,
  uid: string,
  newRole: Role,
  promotedBy: string,
  method: 'AGE_POLICY' | 'MANUAL',
  note?: string
): Promise<void> {
  const member = await getMember(familyId, uid);
  if (!member) {
    throw new Error('Member not found');
  }

  const docRef = doc(firestore, COLLECTION(familyId), uid);
  await updateDoc(docRef, {
    role: newRole,
    transition: {
      fromRole: member.role,
      toRole: newRole,
      promotedAt: serverTimestamp(),
      promotedByUid: promotedBy,
      method,
      note: note || null,
    },
    updatedAt: serverTimestamp(),
  });
}

