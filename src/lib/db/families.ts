/**
 * Family data access layer
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
import { Family, FamilyPolicy } from '../types';

const COLLECTION = 'families';

/**
 * Generate a unique invite code
 */
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Get family by ID
 */
export async function getFamily(familyId: string): Promise<Family | null> {
  const docRef = doc(firestore, COLLECTION, familyId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    inviteCode: data.inviteCode,
    familyPolicy: data.familyPolicy,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    createdBy: data.createdBy,
  };
}

/**
 * Get family by invite code
 */
export async function getFamilyByInviteCode(
  inviteCode: string
): Promise<Family | null> {
  const q = query(
    collection(firestore, COLLECTION),
    where('inviteCode', '==', inviteCode)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    inviteCode: data.inviteCode,
    familyPolicy: data.familyPolicy,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    createdBy: data.createdBy,
  };
}

/**
 * Create family with default policy
 */
export async function createFamily(data: {
  name: string;
  createdBy: string;
}): Promise<string> {
  const defaultPolicy: FamilyPolicy = {
    teenAge: 13,
    adultAge: 18,
    allowManualPromotion: true,
    allowTeenRole: true,
  };

  const inviteCode = generateInviteCode();
  const docRef = doc(collection(firestore, COLLECTION));

  await setDoc(docRef, {
    name: data.name,
    inviteCode,
    familyPolicy: defaultPolicy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: data.createdBy,
  });

  return docRef.id;
}

/**
 * Update family policy (DEPRECATED)
 * @deprecated Use updateFamilyPolicyCallable from @/lib/functions instead
 * This function is kept for backward compatibility but should not be used.
 * Use the callable function updateFamilyPolicyCallable which includes validation and audit logs.
 */
export async function updateFamilyPolicy(
  familyId: string,
  policy: Partial<FamilyPolicy>
): Promise<void> {
  const docRef = doc(firestore, COLLECTION, familyId);
  await updateDoc(docRef, {
    'familyPolicy': policy,
    updatedAt: serverTimestamp(),
  });
}

