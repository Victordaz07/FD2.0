/**
 * Firebase Functions for FD2.0
 * High-risk operations: changeMemberRole, updateFamilyPolicy
 * All operations create audit logs
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { calculateExpiresAt, toBool } from './attentionHelpers';

admin.initializeApp();

const db = admin.firestore();

/**
 * Audit log action types
 */
type AuditAction =
  | 'MEMBER_ROLE_CHANGED'
  | 'FAMILY_POLICY_UPDATED'
  | 'TASK_COMPLETION_APPROVED'
  | 'TASK_COMPLETION_REJECTED'
  | 'ALLOWANCE_LEDGER_ENTRY_CREATED'
  | 'PUSH_TEST_SENT'
  | 'ATTENTION_SENT'
  | 'ATTENTION_ACK'
  | 'ATTENTION_CANCELLED'
  | 'ATTENTION_MODE_UPDATED'
  | 'ATTENTION_MODE_FORCED_ON';

/**
 * Create an audit log entry (append-only)
 */
async function createAuditLog(
  familyId: string,
  action: AuditAction,
  actorUid: string,
  metadata: {
    targetUid?: string;
    [key: string]: unknown;
  }
): Promise<void> {
  const auditLogRef = db.collection('audit_logs').doc();
  await auditLogRef.set({
    id: auditLogRef.id,
    familyId,
    action,
    actorUid,
    targetUid: metadata.targetUid || null,
    metadata,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Get user's role in a family
 */
async function getUserRoleInFamily(
  familyId: string,
  uid: string
): Promise<string | null> {
  const memberDoc = await db
    .collection('families')
    .doc(familyId)
    .collection('members')
    .doc(uid)
    .get();

  if (!memberDoc.exists) {
    return null;
  }

  return memberDoc.data()?.role || null;
}

/**
 * Change member role (callable function)
 * Validates permissions and creates audit log
 */
export const changeMemberRole = functions.https.onCall(
  async (data, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { familyId, targetUid, newRole, method, note } = data;

    // Validate input
    if (!familyId || !targetUid || !newRole || !method) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: familyId, targetUid, newRole, method'
      );
    }

    if (!['AGE_POLICY', 'MANUAL'].includes(method)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Method must be AGE_POLICY or MANUAL'
      );
    }

    const validRoles = [
      'PARENT',
      'CO_PARENT',
      'ADULT_MEMBER',
      'TEEN',
      'CHILD',
      'VIEWER',
    ];
    if (!validRoles.includes(newRole)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid role'
      );
    }

    const actorUid = context.auth.uid;

    // Get actor's role
    const actorRole = await getUserRoleInFamily(familyId, actorUid);
    if (!actorRole) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Actor is not a member of this family'
      );
    }

    // Validate permissions: Only PARENT or CO_PARENT can change roles
    if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only PARENT or CO_PARENT can change member roles'
      );
    }

    // Validate: PARENT and CO_PARENT cannot change PARENT/CO_PARENT roles
    // Only PARENT can change CO_PARENT
    const targetMemberDoc = await db
      .collection('families')
      .doc(familyId)
      .collection('members')
      .doc(targetUid)
      .get();

    if (!targetMemberDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Target member not found'
      );
    }

    const targetRole = targetMemberDoc.data()?.role;
    if (targetRole === 'PARENT' || targetRole === 'CO_PARENT') {
      if (actorRole !== 'PARENT') {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only PARENT can change PARENT or CO_PARENT roles'
        );
      }
    }

    // Verify family exists
    const familyDoc = await db.collection('families').doc(familyId).get();
    if (!familyDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Family not found');
    }

    // Update member role
    const memberRef = db
      .collection('families')
      .doc(familyId)
      .collection('members')
      .doc(targetUid);

    await memberRef.update({
      role: newRole,
      transition: {
        fromRole: targetRole,
        toRole: newRole,
        promotedAt: admin.firestore.FieldValue.serverTimestamp(),
        promotedByUid: actorUid,
        method,
        note: note || null,
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create audit log
    await createAuditLog(familyId, 'MEMBER_ROLE_CHANGED', actorUid, {
      targetUid,
      fromRole: targetRole,
      toRole: newRole,
      method,
      note: note || null,
    });

    return { success: true };
  }
);

/**
 * Update family policy (callable function)
 * Validates permissions and creates audit log
 */
export const updateFamilyPolicy = functions.https.onCall(
  async (data, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { familyId, policy } = data;

    // Validate input
    if (!familyId || !policy) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: familyId, policy'
      );
    }

    const actorUid = context.auth.uid;

    // Get actor's role
    const actorRole = await getUserRoleInFamily(familyId, actorUid);
    if (!actorRole) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Actor is not a member of this family'
      );
    }

    // Validate permissions: Only PARENT can update family policy
    if (actorRole !== 'PARENT') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only PARENT can update family policy'
      );
    }

    // Get current family policy
    const familyDoc = await db.collection('families').doc(familyId).get();
    if (!familyDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Family not found');
    }

    const currentPolicy = familyDoc.data()?.familyPolicy || {};

    // Update family policy (merge partial update)
    const updatedPolicy = { ...currentPolicy, ...policy };

    await db.collection('families').doc(familyId).update({
      familyPolicy: updatedPolicy,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create audit log
    await createAuditLog(familyId, 'FAMILY_POLICY_UPDATED', actorUid, {
      previousPolicy: currentPolicy,
      newPolicy: updatedPolicy,
      changes: policy,
    });

    return { success: true };
  }
);

/**
 * Calculate periodKey based on task schedule and completion date (server-side)
 */
function calculatePeriodKeyServer(
  schedule: { frequency: string;[key: string]: unknown } | undefined,
  completedAt: admin.firestore.Timestamp
): string {
  if (!schedule || schedule.frequency === 'one_time') {
    return 'once';
  }

  const date = completedAt.toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (schedule.frequency) {
    case 'daily':
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    case 'weekly': {
      // Calculate ISO week number
      const startOfYear = new Date(year, 0, 1);
      const daysSinceStart = Math.floor(
        (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    }

    case 'monthly':
      return `${year}-${month.toString().padStart(2, '0')}`;

    default:
      return 'once';
  }
}

/**
 * Approve task completion (callable function)
 * Validates permissions, prevents duplicates, creates ledger entry and audit log
 */
export const approveTaskCompletion = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { familyId, completionId } = data;

  if (!familyId || !completionId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: familyId, completionId'
    );
  }

  const actorUid = context.auth.uid;

  // Get actor's role
  const actorRole = await getUserRoleInFamily(familyId, actorUid);
  if (!actorRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Actor is not a member of this family'
    );
  }

  // Validate permissions: Only PARENT or CO_PARENT can approve
  if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only PARENT or CO_PARENT can approve task completions'
    );
  }

  // Get completion
  const completionRef = db
    .collection('families')
    .doc(familyId)
    .collection('task_completions')
    .doc(completionId);
  const completionDoc = await completionRef.get();

  if (!completionDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Task completion not found');
  }

  const completionData = completionDoc.data()!;
  if (completionData.status !== 'pending_approval') {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Task completion is not pending approval'
    );
  }

  // Get task
  const taskRef = db.collection('families').doc(familyId).collection('tasks').doc(completionData.taskId);
  const taskDoc = await taskRef.get();

  if (!taskDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Task not found');
  }

  const taskData = taskDoc.data()!;
  const schedule = taskData.schedule;

  // Recalculate periodKey server-side (don't trust client)
  const completedAt = completionData.completedAt as admin.firestore.Timestamp;
  const periodKeyServer = calculatePeriodKeyServer(schedule, completedAt);
  const periodKeyClient = completionData.periodKey as string;

  // Validate that client-calculated periodKey matches server calculation
  if (periodKeyClient !== periodKeyServer) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'PeriodKey mismatch: client calculation does not match server validation'
    );
  }

  // Use server-calculated periodKey for duplicate verification (defense in depth)
  const periodKey = periodKeyServer;

  // Verify no duplicate approved completion for (taskId, memberUid, periodKey)
  const existingCompletionsQuery = await db
    .collection('families')
    .doc(familyId)
    .collection('task_completions')
    .where('taskId', '==', completionData.taskId)
    .where('memberUid', '==', completionData.memberUid)
    .where('periodKey', '==', periodKey)
    .where('status', '==', 'approved')
    .get();

  if (!existingCompletionsQuery.empty) {
    throw new functions.https.HttpsError(
      'already-exists',
      'Ya existe una aprobación para este periodo'
    );
  }

  // Update completion status
  await completionRef.update({
    status: 'approved',
    approvedBy: actorUid,
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Create ledger entry if task has points or amountCents
  if (taskData.points || taskData.amountCents) {
    const ledgerRef = db.collection('families').doc(familyId).collection('allowance_ledger').doc();
    await ledgerRef.set({
      id: ledgerRef.id,
      familyId,
      memberUid: completionData.memberUid,
      amountCents: taskData.amountCents || null,
      points: taskData.points || null,
      type: 'credit',
      source: 'task_completion',
      sourceId: completionId,
      description: `Completar tarea: ${taskData.title}`,
      entryDate: completedAt,
      createdBy: actorUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Create audit log
  await createAuditLog(familyId, 'TASK_COMPLETION_APPROVED', actorUid, {
    targetUid: completionData.memberUid,
    completionId,
    taskId: completionData.taskId,
    periodKey,
    pointsAwarded: taskData.points || null,
    amountCentsAwarded: taskData.amountCents || null,
  });

  return { success: true };
});

/**
 * Reject task completion (callable function)
 * Validates permissions and creates audit log
 */
export const rejectTaskCompletion = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { familyId, completionId, reason } = data;

  if (!familyId || !completionId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: familyId, completionId'
    );
  }

  const actorUid = context.auth.uid;

  // Get actor's role
  const actorRole = await getUserRoleInFamily(familyId, actorUid);
  if (!actorRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Actor is not a member of this family'
    );
  }

  // Validate permissions: Only PARENT or CO_PARENT can reject
  if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only PARENT or CO_PARENT can reject task completions'
    );
  }

  // Get completion
  const completionRef = db
    .collection('families')
    .doc(familyId)
    .collection('task_completions')
    .doc(completionId);
  const completionDoc = await completionRef.get();

  if (!completionDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Task completion not found');
  }

  const completionData = completionDoc.data()!;
  if (completionData.status !== 'pending_approval') {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Task completion is not pending approval'
    );
  }

  // Update completion status
  await completionRef.update({
    status: 'rejected',
    rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
    rejectionReason: reason || null,
  });

  // Create audit log
  await createAuditLog(familyId, 'TASK_COMPLETION_REJECTED', actorUid, {
    targetUid: completionData.memberUid,
    completionId,
    taskId: completionData.taskId,
    reason: reason || null,
  });

  return { success: true };
});

/**
 * Add allowance ledger entry manually (callable function)
 * Validates permissions and creates audit log
 */
export const addAllowanceLedgerEntry = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { familyId, memberUid, amountCents, points, type, description } = data;

  if (!familyId || !memberUid || !type || !description) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: familyId, memberUid, type, description'
    );
  }

  // Validate: at least one of amountCents or points must be provided
  if (!amountCents && !points) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Debe proporcionar amountCents o points'
    );
  }

  if (type !== 'credit' && type !== 'debit') {
    throw new functions.https.HttpsError('invalid-argument', 'Type must be credit or debit');
  }

  const actorUid = context.auth.uid;

  // Get actor's role
  const actorRole = await getUserRoleInFamily(familyId, actorUid);
  if (!actorRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Actor is not a member of this family'
    );
  }

  // Validate permissions: Only PARENT or CO_PARENT can add ledger entries
  if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only PARENT or CO_PARENT can add ledger entries'
    );
  }

  // Verify member exists in family
  const memberDoc = await db
    .collection('families')
    .doc(familyId)
    .collection('members')
    .doc(memberUid)
    .get();

  if (!memberDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Member not found in family');
  }

  // Create ledger entry
  const ledgerRef = db.collection('families').doc(familyId).collection('allowance_ledger').doc();
  await ledgerRef.set({
    id: ledgerRef.id,
    familyId,
    memberUid,
    amountCents: amountCents || null,
    points: points || null,
    type,
    source: 'manual',
    sourceId: null,
    description,
    entryDate: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: actorUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Create audit log
  await createAuditLog(familyId, 'ALLOWANCE_LEDGER_ENTRY_CREATED', actorUid, {
    targetUid: memberUid,
    entryId: ledgerRef.id,
    amountCents: amountCents || null,
    points: points || null,
    type,
    description,
  });

  return { success: true, entryId: ledgerRef.id };
});

/**
 * TEMPORAL: Send test push notification to self
 * TODO: Remove in hardening phase
 */
export const sendTestPushToSelf = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const actorUid = context.auth.uid;

  // Get user's device token
  const userDoc = await db.collection('users').doc(actorUid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Usuario no encontrado');
  }

  const userData = userDoc.data()!;
  const deviceTokens = userData.deviceTokens || {};

  // Get token for current platform (simplified: try both)
  const token = deviceTokens.ios?.token || deviceTokens.android?.token;
  if (!token) {
    throw new functions.https.HttpsError('failed-precondition', 'No se encontró token de dispositivo');
  }

  // Send push notification via Expo Push Notification API
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: 'Test Push',
        body: 'Esta es una notificación de prueba',
        data: { type: 'TEST' },
        priority: 'high',
        channelId: 'attention_high', // Android channel
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Expo API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();

    // Check if push was sent successfully
    if (result.data?.status === 'error') {
      throw new functions.https.HttpsError(
        'internal',
        result.data.message || 'Error al enviar notificación'
      );
    }

    // Optional: Create audit log
    await createAuditLog('', 'PUSH_TEST_SENT', actorUid, {
      tokenUsed: token.substring(0, 10) + '...',
      platform: deviceTokens.ios ? 'ios' : 'android',
    });

    return { success: true, receiptId: result.data?.id };
  } catch (error: any) {
    console.error('Error sending test push:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Error al enviar notificación de prueba'
    );
  }
});

// =========================
// Attention Ring (PR1)
// =========================

/**
 * Send attention request (callable function)
 * Validates permissions, rate limit, attentionMode, sends push and creates audit log
 */
export const sendAttentionRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { familyId, targetUid, intensity, durationSec, message } = data;

  if (!familyId || !targetUid || !intensity || !durationSec) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos: familyId, targetUid, intensity, durationSec'
    );
  }

  if (!['normal', 'loud'].includes(intensity)) {
    throw new functions.https.HttpsError('invalid-argument', 'Intensity debe ser "normal" o "loud"');
  }

  if (![15, 30, 60].includes(durationSec)) {
    throw new functions.https.HttpsError('invalid-argument', 'durationSec debe ser 15, 30 o 60');
  }

  const actorUid = context.auth.uid;

  // Get actor's role
  const actorRole = await getUserRoleInFamily(familyId, actorUid);
  if (!actorRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No eres miembro de esta familia'
    );
  }

  // Validate permissions: Only PARENT or CO_PARENT can send attention requests
  if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo PARENT o CO_PARENT pueden enviar solicitudes de atención'
    );
  }

  // Verify target is a member of the family
  const targetMemberDoc = await db
    .collection('families')
    .doc(familyId)
    .collection('members')
    .doc(targetUid)
    .get();

  if (!targetMemberDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'El miembro objetivo no existe en la familia');
  }

  // Read target's attentionMode
  const targetData = targetMemberDoc.data()!;
  const attentionMode = targetData.attentionMode || { enabled: false, allowLoud: false };
  const now = admin.firestore.Timestamp.now();
  const forcedUntil = attentionMode.forcedUntil
    ? (attentionMode.forcedUntil as admin.firestore.Timestamp)
    : null;

  // Determine effective enabled state (forcedUntil overrides enabled)
  const isForced = forcedUntil && forcedUntil.toMillis() > now.toMillis();
  const effectiveEnabled = isForced || attentionMode.enabled;

  // Determine final intensity (apply downgrades)
  let finalIntensity: 'normal' | 'loud' = intensity;
  if (!effectiveEnabled && intensity === 'loud') {
    // If attentionMode is disabled, downgrade loud to normal
    finalIntensity = 'normal';
  } else if (!attentionMode.allowLoud && intensity === 'loud' && !isForced) {
    // If allowLoud is false and not forced, downgrade to normal
    finalIntensity = 'normal';
  }

  // Rate limit: 3 requests per targetUid every 10 minutes
  const nowMillis = now.toMillis();
  const rateBucket = Math.floor(nowMillis / (10 * 60 * 1000)); // 10-minute bucket

  // Query for recent requests in the same bucket (any status except expired/failed count)
  const recentRequestsQuery = await db
    .collection('families')
    .doc(familyId)
    .collection('attention_requests')
    .where('targetUid', '==', targetUid)
    .where('rateBucket', '==', rateBucket)
    .get();

  // Filter to count only active, acknowledged, or cancelled (exclude expired/failed)
  const recentCount = recentRequestsQuery.docs.filter(
    (doc) => !['expired', 'failed'].includes(doc.data().status)
  ).length;

  if (recentCount >= 3) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      'Demasiadas solicitudes. Máximo 3 por cada 10 minutos por persona.'
    );
  }

  // Calculate expiresAt
  const expiresAt = calculateExpiresAt(durationSec);

  // Create attention request document
  const requestRef = db.collection('families').doc(familyId).collection('attention_requests').doc();
  await requestRef.set({
    id: requestRef.id,
    familyId,
    targetUid,
    triggeredByUid: actorUid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt,
    intensity: finalIntensity,
    durationSec,
    message: message || null,
    status: 'active',
    rateBucket,
  });

  // Get target user's device tokens
  const targetUserDoc = await db.collection('users').doc(targetUid).get();
  if (!targetUserDoc.exists) {
    // Mark request as failed
    await requestRef.update({
      status: 'failed',
      failReason: 'Usuario no encontrado',
    });
    throw new functions.https.HttpsError('not-found', 'Usuario objetivo no encontrado');
  }

  const targetUserData = targetUserDoc.data()!;
  const deviceTokens = targetUserData.deviceTokens || {};
  const token = deviceTokens.ios?.token || deviceTokens.android?.token;

  if (!token) {
    // Mark request as failed
    await requestRef.update({
      status: 'failed',
      failReason: 'No se encontró token de dispositivo',
    });
    throw new functions.https.HttpsError(
      'failed-precondition',
      'El usuario objetivo no tiene token de dispositivo registrado'
    );
  }

  // Send push notification via Expo Push Notification API
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify({
        to: token,
        sound: 'default',
        title: '🔔 Solicitud de Atención',
        body: message || 'Alguien necesita tu atención',
        data: {
          type: 'ATTENTION_RING',
          requestId: requestRef.id,
          familyId,
          intensity: finalIntensity,
          durationSec,
        },
        priority: 'high',
        channelId: 'attention_high', // Android channel
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      await requestRef.update({
        status: 'failed',
        failReason: `Error al enviar push: ${response.status}`,
      });
      throw new Error(`Expo API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();

    if (result.data?.status === 'error') {
      await requestRef.update({
        status: 'failed',
        failReason: result.data.message || 'Error al enviar notificación',
      });
      throw new functions.https.HttpsError(
        'internal',
        result.data.message || 'Error al enviar notificación'
      );
    }
  } catch (error: any) {
    console.error('Error sending attention push:', error);
    await requestRef.update({
      status: 'failed',
      failReason: error.message || 'Error desconocido',
    });
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Error al enviar notificación de atención'
    );
  }

  // Create audit log
  await createAuditLog(familyId, 'ATTENTION_SENT', actorUid, {
    targetUid,
    requestId: requestRef.id,
    intensity: finalIntensity,
    durationSec,
    message: message || null,
  });

  return { success: true, requestId: requestRef.id };
});

/**
 * Acknowledge attention request (callable function)
 * Only the target user can acknowledge their own requests
 */
export const ackAttentionRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { familyId, requestId } = data;

  if (!familyId || !requestId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos: familyId, requestId'
    );
  }

  const actorUid = context.auth.uid;

  // Get request
  const requestRef = db
    .collection('families')
    .doc(familyId)
    .collection('attention_requests')
    .doc(requestId);
  const requestDoc = await requestRef.get();

  if (!requestDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Solicitud no encontrada');
  }

  const requestData = requestDoc.data()!;

  // Validate: Only the target user can acknowledge
  if (requestData.targetUid !== actorUid) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo el destinatario puede reconocer esta solicitud'
    );
  }

  // Validate status - idempotent: if already acknowledged, return success
  if (requestData.status === 'acknowledged') {
    return { success: true, alreadyAcknowledged: true };
  }

  if (requestData.status !== 'active') {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'La solicitud no está activa'
    );
  }

  // Update request status
  await requestRef.update({
    status: 'acknowledged',
    ackAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Create audit log
  await createAuditLog(familyId, 'ATTENTION_ACK', actorUid, {
    targetUid: requestData.targetUid,
    requestId,
    triggeredByUid: requestData.triggeredByUid,
  });

  return { success: true };
});

/**
 * Cancel attention request (callable function)
 * Only PARENT/CO_PARENT can cancel requests
 */
export const cancelAttentionRequest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { familyId, requestId } = data;

  if (!familyId || !requestId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos: familyId, requestId'
    );
  }

  const actorUid = context.auth.uid;

  // Get actor's role
  const actorRole = await getUserRoleInFamily(familyId, actorUid);
  if (!actorRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No eres miembro de esta familia'
    );
  }

  // Validate permissions: Only PARENT or CO_PARENT can cancel
  if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo PARENT o CO_PARENT pueden cancelar solicitudes'
    );
  }

  // Get request
  const requestRef = db
    .collection('families')
    .doc(familyId)
    .collection('attention_requests')
    .doc(requestId);
  const requestDoc = await requestRef.get();

  if (!requestDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Solicitud no encontrada');
  }

  const requestData = requestDoc.data()!;

  // Validate status - idempotent: if already cancelled, return success
  if (requestData.status === 'cancelled') {
    return { success: true, alreadyCancelled: true };
  }

  if (requestData.status !== 'active') {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'La solicitud no está activa'
    );
  }

  // Update request status
  await requestRef.update({
    status: 'cancelled',
    cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Create audit log
  await createAuditLog(familyId, 'ATTENTION_CANCELLED', actorUid, {
    targetUid: requestData.targetUid,
    requestId,
    triggeredByUid: requestData.triggeredByUid,
  });

  return { success: true };
});

/**
 * Set attention mode (callable function)
 * Users can only update their own attentionMode
 */
export const setAttentionMode = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { familyId, enabled, allowLoud } = data;

  if (!familyId || typeof enabled !== 'boolean') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos: familyId, enabled'
    );
  }

  if (allowLoud !== undefined && typeof allowLoud !== 'boolean') {
    throw new functions.https.HttpsError('invalid-argument', 'allowLoud debe ser boolean');
  }

  const actorUid = context.auth.uid;

  // Verify membership
  const memberDoc = await db
    .collection('families')
    .doc(familyId)
    .collection('members')
    .doc(actorUid)
    .get();

  if (!memberDoc.exists) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No eres miembro de esta familia'
    );
  }

  // Only self can update (members/{uid} document matches actorUid)
  // This is already enforced by the fact that we're updating members/{actorUid}

  // Optional: If enabled=false, don't allow allowLoud=true
  const finalAllowLoud = allowLoud !== undefined ? allowLoud : (enabled ? true : false);
  const finalAllowLoudValue = enabled ? finalAllowLoud : false;

  // Force boolean conversion - defensive programming (handles string "false" correctly)
  const enabledBoolean = toBool(enabled);
  const allowLoudBoolean = toBool(finalAllowLoudValue);

  // Update attentionMode
  const memberRef = db.collection('families').doc(familyId).collection('members').doc(actorUid);
  await memberRef.update({
    'attentionMode.enabled': enabledBoolean,
    'attentionMode.allowLoud': allowLoudBoolean,
    'attentionMode.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
    'attentionMode.updatedByUid': actorUid,
  });

  // Create audit log
  await createAuditLog(familyId, 'ATTENTION_MODE_UPDATED', actorUid, {
    targetUid: actorUid,
    enabled: enabledBoolean,
    allowLoud: allowLoudBoolean,
  });

  return { success: true };
});

/**
 * Force attention mode ON (callable function)
 * Only PARENT/CO_PARENT can force attention mode on for a target user
 */
export const forceAttentionModeOn = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
  }

  const { familyId, targetUid, forcedMinutes } = data;

  if (!familyId || !targetUid || !forcedMinutes) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan campos requeridos: familyId, targetUid, forcedMinutes'
    );
  }

  if (typeof forcedMinutes !== 'number' || forcedMinutes < 1 || forcedMinutes > 120) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'forcedMinutes debe ser un número entre 1 y 120'
    );
  }

  const actorUid = context.auth.uid;

  // Get actor's role
  const actorRole = await getUserRoleInFamily(familyId, actorUid);
  if (!actorRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No eres miembro de esta familia'
    );
  }

  // Validate permissions: Only PARENT or CO_PARENT can force
  if (actorRole !== 'PARENT' && actorRole !== 'CO_PARENT') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo PARENT o CO_PARENT pueden forzar el modo de atención'
    );
  }

  // Verify target is a member
  const targetMemberDoc = await db
    .collection('families')
    .doc(familyId)
    .collection('members')
    .doc(targetUid)
    .get();

  if (!targetMemberDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'El miembro objetivo no existe en la familia');
  }

  // Calculate forcedUntil timestamp
  const now = admin.firestore.Timestamp.now();
  const forcedUntilSeconds = now.seconds + forcedMinutes * 60;
  const forcedUntil = admin.firestore.Timestamp.fromMillis(forcedUntilSeconds * 1000);

  // Update attentionMode: set enabled=true and forcedUntil
  const memberRef = db.collection('families').doc(familyId).collection('members').doc(targetUid);
  await memberRef.update({
    'attentionMode.enabled': true,
    'attentionMode.forcedUntil': forcedUntil,
    'attentionMode.updatedAt': admin.firestore.FieldValue.serverTimestamp(),
    'attentionMode.updatedByUid': actorUid,
  });

  // Create audit log
  await createAuditLog(familyId, 'ATTENTION_MODE_FORCED_ON', actorUid, {
    targetUid,
    forcedMinutes,
    forcedUntil: forcedUntil.toMillis(),
  });

  return { success: true, forcedUntil: forcedUntil.toMillis() };
});

