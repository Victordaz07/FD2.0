/**
 * Client-side service for calling Firebase Functions
 * High-risk operations go through callable functions
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { Role, FamilyPolicy } from '../types';

/**
 * Change member role via callable function
 * Validates permissions server-side and creates audit log
 */
export async function changeMemberRole(
  familyId: string,
  targetUid: string,
  newRole: Role,
  method: 'AGE_POLICY' | 'MANUAL',
  note?: string
): Promise<void> {
  const changeMemberRoleFn = httpsCallable(functions, 'changeMemberRole');
  
  try {
    await changeMemberRoleFn({
      familyId,
      targetUid,
      newRole,
      method,
      note: note || null,
    });
  } catch (error: any) {
    // Re-throw with clearer error messages
    if (error.code === 'functions/permission-denied') {
      throw new Error('No tienes permisos para cambiar roles. Solo PARENT y CO_PARENT pueden cambiar roles de miembros.');
    }
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Debes estar autenticado para realizar esta acción.');
    }
    if (error.code === 'functions/not-found') {
      throw new Error('Miembro o familia no encontrado.');
    }
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Datos inválidos.');
    }
    throw new Error(error.message || 'Error al cambiar el rol del miembro.');
  }
}

/**
 * Update family policy via callable function
 * Validates permissions server-side and creates audit log
 */
export async function updateFamilyPolicyCallable(
  familyId: string,
  policy: Partial<FamilyPolicy>
): Promise<void> {
  const updateFamilyPolicyFn = httpsCallable(functions, 'updateFamilyPolicy');
  
  try {
    await updateFamilyPolicyFn({
      familyId,
      policy,
    });
  } catch (error: any) {
    // Re-throw with clearer error messages
    if (error.code === 'functions/permission-denied') {
      throw new Error('No tienes permisos para actualizar la política de la familia. Solo PARENT puede hacerlo.');
    }
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Debes estar autenticado para realizar esta acción.');
    }
    if (error.code === 'functions/not-found') {
      throw new Error('Familia no encontrada.');
    }
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Datos inválidos.');
    }
    throw new Error(error.message || 'Error al actualizar la política de la familia.');
  }
}

