/**
 * Task parser for CRUD operations
 * Normalizes Firestore data to ManagedTask type
 * Uses toBool() for all boolean conversions (DEV_RULES)
 */

import { Timestamp } from 'firebase/firestore';
import { toBool } from '../../helpers/booleanHelpers';

export type TaskStatus = 'ACTIVE' | 'COMPLETED';

export interface ManagedTask {
  id: string; // taskId (auto-generated)
  familyId: string;
  title: string;
  description?: string;
  assignedToMemberId: string;
  assignedToDisplayName?: string;
  status: TaskStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Normalize timestamp from Firestore
 * Supports Timestamp, Date, or undefined
 * Returns Date or new Date() if missing (robust for old data)
 */
function normalizeTimestamp(value: any): Date {
  if (!value) {
    return new Date(); // Default to now if missing
  }
  
  // Firestore Timestamp
  if (value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  
  // Already a Date
  if (value instanceof Date) {
    return value;
  }
  
  // Fallback
  return new Date();
}

/**
 * Normalize status
 * Default to 'ACTIVE' if invalid
 */
function normalizeStatus(status: any): TaskStatus {
  const normalized = String(status ?? '').trim().toUpperCase();
  if (normalized === 'COMPLETED') {
    return 'COMPLETED';
  }
  return 'ACTIVE'; // Default
}

/**
 * Parse Firestore document data to ManagedTask
 * Uses toBool() for all boolean conversions
 * 
 * @param docId - Document ID (taskId)
 * @param data - Document data from Firestore
 */
export function parseManagedTask(docId: string, data: any): ManagedTask {
  if (!data) {
    throw new Error('Document data is missing');
  }

  return {
    id: docId,
    familyId: String(data.familyId ?? ''),
    title: String(data.title ?? '').trim(),
    description: data.description ? String(data.description).trim() : undefined,
    assignedToMemberId: String(data.assignedToMemberId ?? ''), // Default '' to avoid crash
    assignedToDisplayName: data.assignedToDisplayName
      ? String(data.assignedToDisplayName).trim()
      : undefined,
    status: normalizeStatus(data.status),
    isActive: toBool(data.isActive, true), // Default true if missing
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    createdBy: String(data.createdBy ?? ''),
  };
}

