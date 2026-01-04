/**
 * Allowance Ledger data access layer
 * NO direct Firestore access from UI - use these functions
 * NOTE: Ledger is append-only. Creates are handled via Firebase Functions only.
 * Clients can only read (list entries).
 */

import {
  doc,
  getDoc,
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
import { AllowanceLedgerEntry } from '../types';

const COLLECTION = (familyId: string) => `families/${familyId}/allowance_ledger`;

/**
 * Get a single ledger entry by ID
 */
export async function getLedgerEntry(
  familyId: string,
  entryId: string
): Promise<AllowanceLedgerEntry | null> {
  const docRef = doc(firestore, COLLECTION(familyId), entryId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    familyId,
    memberUid: data.memberUid,
    amountCents: data.amountCents,
    points: data.points,
    type: data.type,
    source: data.source,
    sourceId: data.sourceId,
    description: data.description,
    entryDate: data.entryDate as Timestamp,
    createdBy: data.createdBy,
    createdAt: data.createdAt as Timestamp,
  };
}

/**
 * List all ledger entries for a specific member (with pagination)
 * Members can read their own entries
 */
export async function listEntriesForMember(
  familyId: string,
  memberUid: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  entries: AllowanceLedgerEntry[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    where('memberUid', '==', memberUid),
    orderBy('entryDate', 'desc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      where('memberUid', '==', memberUid),
      orderBy('entryDate', 'desc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const entries = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      memberUid: data.memberUid,
      amountCents: data.amountCents,
      points: data.points,
      type: data.type,
      source: data.source,
      sourceId: data.sourceId,
      description: data.description,
      entryDate: data.entryDate as Timestamp,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
    };
  });

  return {
    entries,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

/**
 * List all ledger entries for a family (with pagination)
 * Only PARENT/CO_PARENT should use this (enforced by Firestore Rules)
 */
export async function listAllEntriesForParents(
  familyId: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }
): Promise<{
  entries: AllowanceLedgerEntry[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    orderBy('entryDate', 'desc'),
    limit(limitCount + 1) // Fetch one extra to check if there are more
  );

  if (options?.lastDoc) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      orderBy('entryDate', 'desc'),
      startAfter(options.lastDoc),
      limit(limitCount + 1)
    );
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const entries = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      memberUid: data.memberUid,
      amountCents: data.amountCents,
      points: data.points,
      type: data.type,
      source: data.source,
      sourceId: data.sourceId,
      description: data.description,
      entryDate: data.entryDate as Timestamp,
      createdBy: data.createdBy,
      createdAt: data.createdAt as Timestamp,
    };
  });

  return {
    entries,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

/**
 * Compute balance for a member (client-side calculation)
 * Sums all credit entries and subtracts debit entries
 * Returns both amountCents balance and points balance
 * NOTE: This fetches ALL entries (no pagination) to calculate balance accurately
 */
export async function computeBalance(
  familyId: string,
  memberUid: string
): Promise<{ amountCents: number; points: number }> {
  // For balance calculation, we need ALL entries, so we fetch in batches
  let amountCents = 0;
  let points = 0;
  let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
  let hasMore = true;

  while (hasMore) {
    const result = await listEntriesForMember(familyId, memberUid, {
      limitCount: 100, // Fetch in larger batches for balance
      lastDoc: lastDoc || undefined,
    });

    for (const entry of result.entries) {
      const multiplier = entry.type === 'credit' ? 1 : -1;
      
      if (entry.amountCents !== undefined && entry.amountCents !== null) {
        amountCents += entry.amountCents * multiplier;
      }
      
      if (entry.points !== undefined && entry.points !== null) {
        points += entry.points * multiplier;
      }
    }

    lastDoc = result.lastDoc;
    hasMore = result.hasMore;
  }

  return { amountCents, points };
}

