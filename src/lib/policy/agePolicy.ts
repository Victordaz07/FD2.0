/**
 * Age Policy helper functions
 * Computes age groups and eligibility based on family policy
 */

import { AgeGroup, Role, FamilyPolicy, FamilyMember } from '../types';

/**
 * Compute age group based on birth year and family policy
 */
export function computeAgeGroup(
  birthYear: number | undefined,
  familyPolicy: FamilyPolicy,
  currentYear: number = new Date().getFullYear()
): AgeGroup | undefined {
  if (!birthYear) {
    return undefined;
  }

  const age = currentYear - birthYear;

  if (age >= familyPolicy.adultAge) {
    return 'ADULT';
  }
  if (age >= familyPolicy.teenAge && familyPolicy.allowTeenRole) {
    return 'TEEN';
  }
  return 'CHILD';
}

/**
 * Check if member is eligible for a target role based on age policy
 */
export function isEligibleFor(
  roleTarget: Role,
  member: FamilyMember,
  familyPolicy: FamilyPolicy
): boolean {
  // Manual promotion is always allowed if allowManualPromotion is true
  if (familyPolicy.allowManualPromotion) {
    return true;
  }

  // For automatic eligibility based on age
  const ageGroup = computeAgeGroup(member.birthYear, familyPolicy);

  if (roleTarget === 'ADULT_MEMBER' && ageGroup === 'ADULT') {
    return true;
  }

  if (roleTarget === 'TEEN' && ageGroup === 'TEEN' && familyPolicy.allowTeenRole) {
    return true;
  }

  return false;
}

/**
 * Check if a role can manage another role
 */
export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  // Only PARENT and CO_PARENT can manage roles
  if (managerRole !== 'PARENT' && managerRole !== 'CO_PARENT') {
    return false;
  }

  // PARENT and CO_PARENT cannot manage themselves or each other at same level
  if (targetRole === 'PARENT' || targetRole === 'CO_PARENT') {
    return managerRole === 'PARENT'; // Only PARENT can manage CO_PARENT
  }

  // Can manage all other roles
  return true;
}

/**
 * Check if user is a parental role
 */
export function isParentalRole(role: Role): boolean {
  return role === 'PARENT' || role === 'CO_PARENT';
}

/**
 * Check if user is a child role
 */
export function isChildRole(role: Role): boolean {
  return role === 'CHILD' || role === 'TEEN';
}

