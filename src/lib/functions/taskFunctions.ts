/**
 * Client-side service for calling task-related Firebase Functions
 * High-risk operations go through callable functions
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase/config';

const functions = getFunctions(app);

/**
 * Approve task completion via callable function
 * Validates permissions server-side, prevents duplicates, creates ledger entry and audit log
 */
export async function approveTaskCompletion(
  familyId: string,
  completionId: string
): Promise<void> {
  const approveCompletionFn = httpsCallable(functions, 'approveTaskCompletion');

  try {
    await approveCompletionFn({
      familyId,
      completionId,
    });
  } catch (error: any) {
    if (error.code === 'functions/permission-denied') {
      throw new Error('No tienes permisos para aprobar completaciones. Solo PARENT y CO_PARENT pueden hacerlo.');
    }
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Debes estar autenticado para realizar esta acción.');
    }
    if (error.code === 'functions/not-found') {
      throw new Error('Completación o tarea no encontrada.');
    }
    if (error.code === 'functions/failed-precondition') {
      throw new Error('La completación no está pendiente de aprobación.');
    }
    if (error.code === 'functions/already-exists') {
      throw new Error('Ya existe una aprobación para este periodo.');
    }
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Datos inválidos.');
    }
    throw new Error(error.message || 'Error al aprobar la completación.');
  }
}

/**
 * Reject task completion via callable function
 * Validates permissions server-side and creates audit log
 */
export async function rejectTaskCompletion(
  familyId: string,
  completionId: string,
  reason?: string
): Promise<void> {
  const rejectCompletionFn = httpsCallable(functions, 'rejectTaskCompletion');

  try {
    await rejectCompletionFn({
      familyId,
      completionId,
      reason: reason || null,
    });
  } catch (error: any) {
    if (error.code === 'functions/permission-denied') {
      throw new Error('No tienes permisos para rechazar completaciones. Solo PARENT y CO_PARENT pueden hacerlo.');
    }
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Debes estar autenticado para realizar esta acción.');
    }
    if (error.code === 'functions/not-found') {
      throw new Error('Completación no encontrada.');
    }
    if (error.code === 'functions/failed-precondition') {
      throw new Error('La completación no está pendiente de aprobación.');
    }
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Datos inválidos.');
    }
    throw new Error(error.message || 'Error al rechazar la completación.');
  }
}

/**
 * Add allowance ledger entry manually via callable function
 * Validates permissions server-side and creates audit log
 */
export async function addAllowanceLedgerEntry(
  familyId: string,
  memberUid: string,
  data: {
    amountCents?: number;
    points?: number;
    type: 'credit' | 'debit';
    description: string;
  }
): Promise<string> {
  const addEntryFn = httpsCallable(functions, 'addAllowanceLedgerEntry');

  try {
    const result = await addEntryFn({
      familyId,
      memberUid,
      amountCents: data.amountCents || null,
      points: data.points || null,
      type: data.type,
      description: data.description,
    });

    const resultData = result.data as { entryId: string };
    return resultData.entryId;
  } catch (error: any) {
    if (error.code === 'functions/permission-denied') {
      throw new Error('No tienes permisos para agregar entradas al ledger. Solo PARENT y CO_PARENT pueden hacerlo.');
    }
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Debes estar autenticado para realizar esta acción.');
    }
    if (error.code === 'functions/not-found') {
      throw new Error('Miembro no encontrado en la familia.');
    }
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Datos inválidos.');
    }
    throw new Error(error.message || 'Error al agregar entrada al ledger.');
  }
}

