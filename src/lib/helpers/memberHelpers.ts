/**
 * Helper functions for member operations
 */

import { getMember } from '../db/members';
import { Role } from '../types';

/**
 * Get role-based label for fallback display name
 */
function getRoleLabel(role: Role): string {
  switch (role) {
    case 'PARENT':
    case 'CO_PARENT':
      return 'Padre/Tutor';
    case 'ADULT_MEMBER':
      return 'Adulto';
    case 'TEEN':
      return 'Adolescente';
    case 'CHILD':
      return 'Niño/a';
    case 'VIEWER':
      return 'Observador';
    default:
      return 'Un padre/tutor';
  }
}

/**
 * Get display name for a member
 * Priority: member.displayName > role-based label > "Un padre/tutor"
 * 
 * NOTE: This reads from families/{familyId}/members/{uid}, NOT from users/{uid}
 * This is the correct approach because:
 * 1. Users collection is restricted (only owner read)
 * 2. Display name should come from family context (may differ per family)
 * 
 * @param familyId Family ID
 * @param memberUid Member UID
 * @returns Display name or fallback string
 */
export async function getMemberDisplayName(
  familyId: string,
  memberUid: string
): Promise<string> {
  try {
    // Get member from family context (NOT from users)
    const member = await getMember(familyId, memberUid);
    
    if (!member) {
      return 'Un padre/tutor';
    }

    // Priority 1: member.displayName (family context)
    if (member.displayName) {
      return member.displayName;
    }

    // Priority 2: role-based label
    const roleLabel = getRoleLabel(member.role);
    return roleLabel;
  } catch (error) {
    console.error('Error getting member display name:', error);
    return 'Un padre/tutor';
  }
}

