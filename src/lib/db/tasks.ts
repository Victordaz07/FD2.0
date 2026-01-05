/**
 * Tasks data access layer
 * NO direct Firestore access from UI - use these functions
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { Task, TaskSchedule } from '../types';
import { toBool } from '../helpers/booleanHelpers';

const COLLECTION = (familyId: string) => `families/${familyId}/tasks`;

/**
 * Create a new task
 * Only PARENT/CO_PARENT can create tasks (enforced by Firestore Rules)
 */
export async function createTask(
  familyId: string,
  data: {
    title: string;
    description?: string;
    schedule?: TaskSchedule;
    points?: number;
    amountCents?: number;
    requiresApproval: boolean;
    createdBy: string;
  }
): Promise<string> {
  // Validate: at least one of points or amountCents must be provided
  if (!data.points && !data.amountCents) {
    throw new Error('Debe proporcionar points o amountCents');
  }

  const docRef = doc(collection(firestore, COLLECTION(familyId)));

  await setDoc(docRef, {
    familyId,
    title: data.title,
    description: data.description || null,
    isActive: true,
    schedule: data.schedule || null,
    points: data.points || null,
    amountCents: data.amountCents || null,
    // Force boolean - never store strings (handles string "false" correctly)
    requiresApproval: toBool(data.requiresApproval),
    createdBy: data.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update an existing task
 * Only PARENT/CO_PARENT can update (enforced by Firestore Rules)
 */
export async function updateTask(
  familyId: string,
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    schedule?: TaskSchedule;
    points?: number;
    amountCents?: number;
    requiresApproval?: boolean;
  }
): Promise<void> {
  // Validate: if both points and amountCents are being cleared, reject
  if (
    updates.points === null &&
    updates.amountCents === null &&
    !updates.points &&
    !updates.amountCents
  ) {
    // Check current task to ensure at least one exists
    const currentTask = await getTask(familyId, taskId);
    if (currentTask && !currentTask.points && !currentTask.amountCents) {
      throw new Error('Debe mantener al menos points o amountCents');
    }
  }

  const docRef = doc(firestore, COLLECTION(familyId), taskId);

  const updateData: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description || null;
  if (updates.schedule !== undefined) updateData.schedule = updates.schedule || null;
  if (updates.points !== undefined) updateData.points = updates.points || null;
  if (updates.amountCents !== undefined) updateData.amountCents = updates.amountCents || null;
  if (updates.requiresApproval !== undefined) {
    // Force boolean - never store strings (handles string "false" correctly)
    updateData.requiresApproval = toBool(updates.requiresApproval);
  }

  await updateDoc(docRef, updateData);
}

/**
 * Set task active/inactive
 * Only PARENT/CO_PARENT can update (enforced by Firestore Rules)
 */
export async function setTaskActive(
  familyId: string,
  taskId: string,
  isActive: boolean
): Promise<void> {
  const docRef = doc(firestore, COLLECTION(familyId), taskId);
  await updateDoc(docRef, {
    // Force boolean - never store strings (handles string "false" correctly)
    isActive: toBool(isActive),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get a single task by ID
 */
export async function getTask(familyId: string, taskId: string): Promise<Task | null> {
  const docRef = doc(firestore, COLLECTION(familyId), taskId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  // #region agent log
  const rawIsActive = data.isActive;
  const rawRequiresApproval = data.requiresApproval;
  fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'tasks.ts:143', message: 'getTask - raw Firestore data', data: { taskId: docSnap.id, rawIsActiveType: typeof rawIsActive, rawIsActiveValue: rawIsActive, rawRequiresApprovalType: typeof rawRequiresApproval, rawRequiresApprovalValue: rawRequiresApproval }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
  // #endregion
  const normalizedIsActive = toBool(data.isActive);
  const normalizedRequiresApproval = toBool(data.requiresApproval);
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/3b8b70a3-1fde-47ca-9ff3-e066d785c292', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'tasks.ts:150', message: 'getTask - after toBool normalization', data: { taskId: docSnap.id, normalizedIsActiveType: typeof normalizedIsActive, normalizedIsActiveValue: normalizedIsActive, normalizedRequiresApprovalType: typeof normalizedRequiresApproval, normalizedRequiresApprovalValue: normalizedRequiresApproval }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
  // #endregion
  return {
    id: docSnap.id,
    familyId,
    title: data.title,
    description: data.description,
    // Force boolean conversion - GUARANTEED to be boolean, never string
    isActive: Boolean(normalizedIsActive),
    schedule: data.schedule || undefined,
    points: data.points,
    amountCents: data.amountCents,
    // Force boolean conversion - GUARANTEED to be boolean, never string
    requiresApproval: Boolean(normalizedRequiresApproval),
    createdBy: data.createdBy,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
  };
}

/**
 * List all active tasks for a family
 */
export async function listActiveTasks(familyId: string): Promise<Task[]> {
  const q = query(
    collection(firestore, COLLECTION(familyId)),
    where('isActive', '==', true)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      title: data.title,
      description: data.description,
      // Force boolean conversion - GUARANTEED to be boolean, never string
      isActive: Boolean(toBool(data.isActive, false)),
      schedule: data.schedule || undefined,
      points: data.points,
      amountCents: data.amountCents,
      // Force boolean conversion - GUARANTEED to be boolean, never string
      requiresApproval: Boolean(toBool(data.requiresApproval, false)),
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    };
  });
}

/**
 * List all tasks (active and inactive) for a family
 * Useful for admin/parent views
 */
export async function listAllTasks(familyId: string): Promise<Task[]> {
  const q = query(collection(firestore, COLLECTION(familyId)));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      title: data.title,
      description: data.description,
      // Force boolean conversion - GUARANTEED to be boolean, never string
      isActive: Boolean(toBool(data.isActive, false)),
      schedule: data.schedule || undefined,
      points: data.points,
      amountCents: data.amountCents,
      // Force boolean conversion - GUARANTEED to be boolean, never string
      requiresApproval: Boolean(toBool(data.requiresApproval, false)),
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    };
  });
}

/**
 * Delete a task
 * Only PARENT/CO_PARENT can delete (enforced by Firestore Rules)
 */
export async function deleteTask(familyId: string, taskId: string): Promise<void> {
  const docRef = doc(firestore, COLLECTION(familyId), taskId);
  await deleteDoc(docRef);
}

