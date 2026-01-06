/**
 * Member parser for CRUD operations
 * Normalizes Firestore data to ManagedMember type
 * Uses toBool() for all boolean conversions (DEV_RULES)
 */

import { Timestamp } from 'firebase/firestore';
import { toBool } from '../../helpers/booleanHelpers';

export type ManagedRole = 'PARENT' | 'TEEN' | 'CHILD';

export interface ManagedMember {
  id: string; // memberId (auto-generated)
  familyId: string;
  uid?: string; // OPTIONAL - only if has login
  displayName: string;
  role: ManagedRole; // Only PARENT, TEEN, CHILD in v1
  rawRole?: string; // Original role for display (if was CO_PARENT, ADULT_MEMBER, VIEWER)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Normalize timestamp from Firestore
 * Supports Timestamp, Date, or undefined
 * Returns Date or new Date() if missing
 */
function normalizeTimestamp(value: any): Date {
  if (!value) {
    return new Date();
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
 * Map existing roles to v1 roles
 * CO_PARENT/ADULT_MEMBER -> PARENT
 * VIEWER -> CHILD
 * PARENT/TEEN/CHILD -> keep as is
 */
function mapRoleToV1(role: string): { role: ManagedRole; rawRole?: string } {
  const normalized = String(role ?? '').trim().toUpperCase();
  const original = String(role ?? '').trim();
  
  // Map existing roles to v1 roles, but preserve original for display
  if (normalized === 'CO_PARENT' || normalized === 'ADULT_MEMBER') {
    return { role: 'PARENT', rawRole: original };
  }
  
  if (normalized === 'VIEWER') {
    return { role: 'CHILD', rawRole: original };
  }
  
  // Valid v1 roles - no rawRole needed
  if (normalized === 'PARENT' || normalized === 'TEEN' || normalized === 'CHILD') {
    return { role: normalized as ManagedRole };
  }
  
  // Default fallback
  return { role: 'CHILD' };
}

/**
 * Parse Firestore document data to ManagedMember
 * Uses toBool() for all boolean conversions
 * 
 * @param docId - Document ID (memberId)
 * @param data - Document data from Firestore
 */
export function parseManagedMember(docId: string, data: any): ManagedMember {
  if (!data) {
    throw new Error('Document data is missing');
  }

  const roleMapping = mapRoleToV1(data.role);
  
  return {
    id: docId,
    familyId: String(data.familyId ?? ''), // Get from data if exists
    uid: typeof data.uid === 'string' ? data.uid : undefined,
    displayName: String(data.displayName ?? '').trim(),
    role: roleMapping.role,
    rawRole: roleMapping.rawRole,
    isActive: toBool(data.isActive, true), // Default true if missing
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
    createdBy: String(data.createdBy ?? ''),
  };
}
