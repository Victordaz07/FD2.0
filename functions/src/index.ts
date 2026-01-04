/**
 * Firebase Functions for FD2.0
 * High-risk operations: changeMemberRole, updateFamilyPolicy
 * All operations create audit logs
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { calculateRateLimitWindowKey, calculateExpiresAt } from './attentionHelpers';

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

    // Get family policy for validation
    const familyDoc = await db.collection('families').doc(familyId).get();
    if (!familyDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Family not found');
    }

    const familyPolicy = familyDoc.data()?.familyPolicy;

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
  schedule: { frequency: string; [key: string]: unknown } | undefined,
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

