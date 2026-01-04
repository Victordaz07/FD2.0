/**
 * Calendar Events data access layer
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
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { CalendarEvent } from '../types';

const COLLECTION = (familyId: string) => `families/${familyId}/events`;

/**
 * Create a new calendar event
 * Permissions enforced by Firestore Rules:
 * - CHILD always denied
 * - PARENT/CO_PARENT always allowed
 * - TEEN/ADULT_MEMBER allowed if in familyPolicy.calendarCreateRoles
 */
export async function createEvent(
  familyId: string,
  data: {
    title: string;
    description?: string;
    startDate: Timestamp;
    endDate?: Timestamp;
    isAllDay: boolean;
    visibility: 'family' | 'parents_only';
    createdBy: string;
  }
): Promise<string> {
  const docRef = doc(collection(firestore, COLLECTION(familyId)));
  
  await setDoc(docRef, {
    familyId,
    title: data.title,
    description: data.description || null,
    startDate: data.startDate,
    endDate: data.endDate || null,
    isAllDay: data.isAllDay,
    visibility: data.visibility,
    createdBy: data.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update an existing event
 * Creator or PARENT/CO_PARENT can update (enforced by Firestore Rules)
 */
export async function updateEvent(
  familyId: string,
  eventId: string,
  updates: {
    title?: string;
    description?: string;
    startDate?: Timestamp;
    endDate?: Timestamp;
    isAllDay?: boolean;
    visibility?: 'family' | 'parents_only';
  }
): Promise<void> {
  const docRef = doc(firestore, COLLECTION(familyId), eventId);
  
  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description || null;
  if (updates.startDate !== undefined) updateData.startDate = updates.startDate;
  if (updates.endDate !== undefined) updateData.endDate = updates.endDate || null;
  if (updates.isAllDay !== undefined) updateData.isAllDay = updates.isAllDay;
  if (updates.visibility !== undefined) updateData.visibility = updates.visibility;

  await updateDoc(docRef, updateData);
}

/**
 * Delete an event
 * Creator or PARENT/CO_PARENT can delete (enforced by Firestore Rules)
 */
export async function deleteEvent(familyId: string, eventId: string): Promise<void> {
  const docRef = doc(firestore, COLLECTION(familyId), eventId);
  await deleteDoc(docRef);
}

/**
 * Get a single event by ID
 */
export async function getEvent(familyId: string, eventId: string): Promise<CalendarEvent | null> {
  const docRef = doc(firestore, COLLECTION(familyId), eventId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    familyId,
    title: data.title,
    description: data.description,
    startDate: data.startDate as Timestamp,
    endDate: data.endDate as Timestamp | undefined,
    isAllDay: data.isAllDay,
    visibility: data.visibility,
    createdBy: data.createdBy,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
  };
}

/**
 * List events by date range (with pagination)
 * Visibility filtering is enforced by Firestore Rules
 */
export async function listEventsByRange(
  familyId: string,
  startDate: Timestamp,
  endDate: Timestamp,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  events: CalendarEvent[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    where('startDate', '>=', startDate),
    where('startDate', '<=', endDate),
    orderBy('startDate', 'asc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      where('startDate', '>=', startDate),
      where('startDate', '<=', endDate),
      orderBy('startDate', 'asc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const events = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      title: data.title,
      description: data.description,
      startDate: data.startDate as Timestamp,
      endDate: data.endDate as Timestamp | undefined,
      isAllDay: data.isAllDay,
      visibility: data.visibility,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    };
  });

  return {
    events,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

/**
 * List all events for a family (with pagination)
 * Useful for admin/parent views
 * Visibility filtering is enforced by Firestore Rules
 */
export async function listAllEvents(
  familyId: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  events: CalendarEvent[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    orderBy('startDate', 'asc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      orderBy('startDate', 'asc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const events = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      title: data.title,
      description: data.description,
      startDate: data.startDate as Timestamp,
      endDate: data.endDate as Timestamp | undefined,
      isAllDay: data.isAllDay,
      visibility: data.visibility,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    };
  });

  return {
    events,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

