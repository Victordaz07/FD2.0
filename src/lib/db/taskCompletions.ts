/**
 * Task Completions data access layer
 * NO direct Firestore access from UI - use these functions
 * NOTE: Updates (approve/reject) are handled via Firebase Functions only
 */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { TaskCompletion, Task, TaskSchedule } from '../types';
import { getTask } from './tasks';

const COLLECTION = (familyId: string) => `families/${familyId}/task_completions`;

/**
 * Calculate periodKey based on task schedule and current date
 */
function calculatePeriodKey(
  schedule: TaskSchedule | undefined,
  completedAt: Timestamp
): string {
  if (!schedule || schedule.frequency === 'one_time') {
    return 'once';
  }

  const date = completedAt.toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  switch (schedule.frequency) {
    case 'daily':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    case 'weekly':
      // Calculate ISO week number
      const startOfYear = new Date(year, 0, 1);
      const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    
    case 'monthly':
      return `${year}-${month.toString().padStart(2, '0')}`;
    
    default:
      return 'once';
  }
}

/**
 * Create a task completion
 * Members can create completions for themselves
 * Status is set based on task.requiresApproval
 */
export async function createCompletion(
  familyId: string,
  data: {
    taskId: string;
    memberUid: string;
    createdBy: string;
  }
): Promise<string> {
  // Get task to check requiresApproval and calculate periodKey
  const task = await getTask(familyId, data.taskId);
  if (!task) {
    throw new Error('Tarea no encontrada');
  }

  if (!task.isActive) {
    throw new Error('No se puede completar una tarea inactiva');
  }

  // Calculate periodKey
  const completedAt = Timestamp.now();
  const periodKey = calculatePeriodKey(task.schedule, completedAt);

  // Determine initial status
  const status = task.requiresApproval ? 'pending_approval' : 'approved';

  const docRef = doc(collection(firestore, COLLECTION(familyId)));
  
  await setDoc(docRef, {
    familyId,
    taskId: data.taskId,
    memberUid: data.memberUid,
    periodKey,
    completedAt,
    status,
    pointsAwarded: task.points || null,
    amountCentsAwarded: task.amountCents || null,
    createdBy: data.createdBy,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Get a single completion by ID
 */
export async function getCompletion(
  familyId: string,
  completionId: string
): Promise<TaskCompletion | null> {
  const docRef = doc(firestore, COLLECTION(familyId), completionId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    familyId,
    taskId: data.taskId,
    memberUid: data.memberUid,
    periodKey: data.periodKey,
    completedAt: data.completedAt as Timestamp,
    status: data.status,
    approvedBy: data.approvedBy,
    approvedAt: data.approvedAt as Timestamp | undefined,
    rejectedAt: data.rejectedAt as Timestamp | undefined,
    rejectionReason: data.rejectionReason,
    pointsAwarded: data.pointsAwarded,
    amountCentsAwarded: data.amountCentsAwarded,
    createdBy: data.createdBy,
    createdAt: data.createdAt as Timestamp,
  };
}

/**
 * List completions for a specific task (with pagination)
 */
export async function listCompletionsByTask(
  familyId: string,
  taskId: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  completions: TaskCompletion[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    where('taskId', '==', taskId),
    orderBy('completedAt', 'desc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      where('taskId', '==', taskId),
      orderBy('completedAt', 'desc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const completions = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      taskId: data.taskId,
      memberUid: data.memberUid,
      periodKey: data.periodKey,
      completedAt: data.completedAt as Timestamp,
      status: data.status,
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt as Timestamp | undefined,
      rejectedAt: data.rejectedAt as Timestamp | undefined,
      rejectionReason: data.rejectionReason,
      pointsAwarded: data.pointsAwarded,
      amountCentsAwarded: data.amountCentsAwarded,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
    };
  });

  return {
    completions,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

/**
 * List completions pending approval (with pagination)
 * Only PARENT/CO_PARENT should use this (enforced by Firestore Rules)
 */
export async function listPendingApprovals(
  familyId: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  completions: TaskCompletion[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    where('status', '==', 'pending_approval'),
    orderBy('completedAt', 'desc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      where('status', '==', 'pending_approval'),
      orderBy('completedAt', 'desc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const completions = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      taskId: data.taskId,
      memberUid: data.memberUid,
      periodKey: data.periodKey,
      completedAt: data.completedAt as Timestamp,
      status: data.status,
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt as Timestamp | undefined,
      rejectedAt: data.rejectedAt as Timestamp | undefined,
      rejectionReason: data.rejectionReason,
      pointsAwarded: data.pointsAwarded,
      amountCentsAwarded: data.amountCentsAwarded,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
    };
  });

  return {
    completions,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

/**
 * List completions for a specific member (with pagination)
 */
export async function listCompletionsByMember(
  familyId: string,
  memberUid: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  completions: TaskCompletion[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    where('memberUid', '==', memberUid),
    orderBy('completedAt', 'desc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      where('memberUid', '==', memberUid),
      orderBy('completedAt', 'desc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const completions = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      taskId: data.taskId,
      memberUid: data.memberUid,
      periodKey: data.periodKey,
      completedAt: data.completedAt as Timestamp,
      status: data.status,
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt as Timestamp | undefined,
      rejectedAt: data.rejectedAt as Timestamp | undefined,
      rejectionReason: data.rejectionReason,
      pointsAwarded: data.pointsAwarded,
      amountCentsAwarded: data.amountCentsAwarded,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
    };
  });

  return {
    completions,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

