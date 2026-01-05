/**
 * Client-side service for calling attention-related Firebase Functions
 * High-risk operations go through callable functions
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase/config';

const functions = getFunctions(app);

/**
 * Send attention request (callable function)
 * Validates permissions server-side, applies rate limit, sends push and creates audit log
 */
export async function sendAttentionRequest(
    familyId: string,
    targetUid: string,
    intensity: 'normal' | 'loud',
    durationSec: 15 | 30 | 60,
    message?: string
): Promise<{ success: true; requestId: string }> {
    const sendRequestFn = httpsCallable(functions, 'sendAttentionRequest');

    try {
        const result = await sendRequestFn({
            familyId,
            targetUid,
            intensity,
            durationSec,
            message: message || null,
        });
        return result.data as { success: true; requestId: string };
    } catch (error: any) {
        if (error.code === 'functions/permission-denied') {
            throw new Error('Solo PARENT o CO_PARENT pueden enviar solicitudes de atención');
        }
        if (error.code === 'functions/unauthenticated') {
            throw new Error('Debes estar autenticado para realizar esta acción');
        }
        if (error.code === 'functions/not-found') {
            throw new Error('El miembro objetivo no existe en la familia');
        }
        if (error.code === 'functions/resource-exhausted') {
            throw new Error('Demasiadas solicitudes. Máximo 3 por cada 10 minutos por persona.');
        }
        if (error.code === 'functions/failed-precondition') {
            throw new Error('El usuario objetivo no tiene token de dispositivo registrado');
        }
        if (error.code === 'functions/invalid-argument') {
            throw new Error(error.message || 'Datos inválidos');
        }
        throw new Error(error.message || 'Error al enviar solicitud de atención');
    }
}

/**
 * Acknowledge attention request (callable function)
 * Only the target user can acknowledge their own requests
 */
export async function ackAttentionRequest(
    familyId: string,
    requestId: string
): Promise<{ success: true; alreadyAcknowledged?: boolean }> {
    const ackRequestFn = httpsCallable(functions, 'ackAttentionRequest');

    try {
        const result = await ackRequestFn({
            familyId,
            requestId,
        });
        return result.data as { success: true; alreadyAcknowledged?: boolean };
    } catch (error: any) {
        if (error.code === 'functions/permission-denied') {
            throw new Error('Solo el destinatario puede reconocer esta solicitud');
        }
        if (error.code === 'functions/unauthenticated') {
            throw new Error('Debes estar autenticado para realizar esta acción');
        }
        if (error.code === 'functions/not-found') {
            throw new Error('Solicitud no encontrada');
        }
        if (error.code === 'functions/failed-precondition') {
            throw new Error('La solicitud no está activa');
        }
        if (error.code === 'functions/invalid-argument') {
            throw new Error(error.message || 'Datos inválidos');
        }
        throw new Error(error.message || 'Error al reconocer la solicitud');
    }
}

/**
 * Cancel attention request (callable function)
 * Only PARENT/CO_PARENT can cancel requests
 */
export async function cancelAttentionRequest(
    familyId: string,
    requestId: string
): Promise<{ success: true; alreadyCancelled?: boolean }> {
    const cancelRequestFn = httpsCallable(functions, 'cancelAttentionRequest');

    try {
        const result = await cancelRequestFn({
            familyId,
            requestId,
        });
        return result.data as { success: true; alreadyCancelled?: boolean };
    } catch (error: any) {
        if (error.code === 'functions/permission-denied') {
            throw new Error('Solo PARENT o CO_PARENT pueden cancelar solicitudes');
        }
        if (error.code === 'functions/unauthenticated') {
            throw new Error('Debes estar autenticado para realizar esta acción');
        }
        if (error.code === 'functions/not-found') {
            throw new Error('Solicitud no encontrada');
        }
        if (error.code === 'functions/failed-precondition') {
            throw new Error('La solicitud no está activa');
        }
        if (error.code === 'functions/invalid-argument') {
            throw new Error(error.message || 'Datos inválidos');
        }
        throw new Error(error.message || 'Error al cancelar la solicitud');
    }
}

/**
 * Set attention mode (callable function)
 * Users can only update their own attentionMode
 */
export async function setAttentionMode(
    familyId: string,
    enabled: boolean,
    allowLoud: boolean
): Promise<{ success: true }> {
    const setModeFn = httpsCallable(functions, 'setAttentionMode');

    try {
        const result = await setModeFn({
            familyId,
            // Force boolean - never send strings (handles edge cases correctly)
            enabled: enabled === true,
            allowLoud: allowLoud === true,
        });
        return result.data as { success: true };
    } catch (error: any) {
        if (error.code === 'functions/permission-denied') {
            throw new Error('No eres miembro de esta familia');
        }
        if (error.code === 'functions/unauthenticated') {
            throw new Error('Debes estar autenticado para realizar esta acción');
        }
        if (error.code === 'functions/invalid-argument') {
            throw new Error(error.message || 'Datos inválidos');
        }
        throw new Error(error.message || 'Error al actualizar el modo de atención');
    }
}

/**
 * Force attention mode ON (callable function)
 * Only PARENT/CO_PARENT can force attention mode on for a target user
 */
export async function forceAttentionModeOn(
    familyId: string,
    targetUid: string,
    forcedMinutes: number
): Promise<{ success: true; forcedUntil: number }> {
    const forceModeFn = httpsCallable(functions, 'forceAttentionModeOn');

    try {
        const result = await forceModeFn({
            familyId,
            targetUid,
            forcedMinutes,
        });
        return result.data as { success: true; forcedUntil: number };
    } catch (error: any) {
        if (error.code === 'functions/permission-denied') {
            throw new Error('Solo PARENT o CO_PARENT pueden forzar el modo de atención');
        }
        if (error.code === 'functions/unauthenticated') {
            throw new Error('Debes estar autenticado para realizar esta acción');
        }
        if (error.code === 'functions/not-found') {
            throw new Error('El miembro objetivo no existe en la familia');
        }
        if (error.code === 'functions/invalid-argument') {
            throw new Error(error.message || 'forcedMinutes debe ser un número entre 1 y 120');
        }
        throw new Error(error.message || 'Error al forzar el modo de atención');
    }
}

