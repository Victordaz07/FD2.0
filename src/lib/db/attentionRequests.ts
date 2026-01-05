/**
 * Attention Requests data access layer
 * NO direct Firestore access from UI - use these functions
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
import { AttentionRequest } from '../types';

const COLLECTION = (familyId: string) => `families/${familyId}/attention_requests`;

/**
 * Get a single attention request by ID
 */
export async function getAttentionRequest(
  familyId: string,
  requestId: string
): Promise<AttentionRequest | null> {
  const docRef = doc(firestore, COLLECTION(familyId), requestId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    familyId,
    targetUid: data.targetUid,
    triggeredByUid: data.triggeredByUid,
    createdAt: data.createdAt as Timestamp,
    expiresAt: data.expiresAt as Timestamp,
    intensity: data.intensity,
    durationSec: data.durationSec,
    message: data.message || undefined,
    status: data.status,
    ackAt: data.ackAt ? (data.ackAt as Timestamp) : undefined,
    cancelledAt: data.cancelledAt ? (data.cancelledAt as Timestamp) : undefined,
    failReason: data.failReason || undefined,
    rateKey: data.rateKey,
  };
}

/**
 * List active attention requests for a target user
 */
export async function listActiveRequestsForTarget(
  familyId: string,
  targetUid: string
): Promise<AttentionRequest[]> {
  const q = query(
    collection(firestore, COLLECTION(familyId)),
    where('targetUid', '==', targetUid),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      targetUid: data.targetUid,
      triggeredByUid: data.triggeredByUid,
      createdAt: data.createdAt as Timestamp,
      expiresAt: data.expiresAt as Timestamp,
      intensity: data.intensity,
      durationSec: data.durationSec,
      message: data.message || undefined,
      status: data.status,
      ackAt: data.ackAt ? (data.ackAt as Timestamp) : undefined,
      cancelledAt: data.cancelledAt ? (data.cancelledAt as Timestamp) : undefined,
      failReason: data.failReason || undefined,
      rateKey: data.rateKey || data.rateBucket?.toString() || '', // Backward compatibility
    };
  });
}

/**
 * List all attention requests in a family (for parents)
 * Includes pagination
 */
export async function listAllRequests(
  familyId: string,
  options?: {
    limitCount?: number;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
    status?: 'active' | 'acknowledged' | 'cancelled' | 'expired' | 'failed';
  }
): Promise<{
  requests: AttentionRequest[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> {
  const limitCount = options?.limitCount || 50;
  let q = query(
    collection(firestore, COLLECTION(familyId)),
    orderBy('createdAt', 'desc'),
    limit(limitCount + 1)
  );

  if (options?.status) {
    q = query(
      collection(firestore, COLLECTION(familyId)),
      where('status', '==', options.status),
      orderBy('createdAt', 'desc'),
      limit(limitCount + 1)
    );
  }

  if (options?.lastDoc) {
    if (options?.status) {
      q = query(
        collection(firestore, COLLECTION(familyId)),
        where('status', '==', options.status),
        orderBy('createdAt', 'desc'),
        startAfter(options.lastDoc),
        limit(limitCount + 1)
      );
    } else {
      q = query(
        collection(firestore, COLLECTION(familyId)),
        orderBy('createdAt', 'desc'),
        startAfter(options.lastDoc),
        limit(limitCount + 1)
      );
    }
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > limitCount;
  const docsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

  const requests = docsToReturn.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      familyId,
      targetUid: data.targetUid,
      triggeredByUid: data.triggeredByUid,
      createdAt: data.createdAt as Timestamp,
      expiresAt: data.expiresAt as Timestamp,
      intensity: data.intensity,
      durationSec: data.durationSec,
      message: data.message || undefined,
      status: data.status,
      ackAt: data.ackAt ? (data.ackAt as Timestamp) : undefined,
      cancelledAt: data.cancelledAt ? (data.cancelledAt as Timestamp) : undefined,
      failReason: data.failReason || undefined,
      rateKey: data.rateKey || data.rateBucket?.toString() || '', // Backward compatibility
    };
  });

  return {
    requests,
    lastDoc: docsToReturn.length > 0 ? docsToReturn[docsToReturn.length - 1] : null,
    hasMore,
  };
}

