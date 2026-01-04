/**
 * Core types for FamilyDash 2.0
 */

import { Timestamp } from 'firebase/firestore';

export type Role = 'PARENT' | 'CO_PARENT' | 'ADULT_MEMBER' | 'TEEN' | 'CHILD' | 'VIEWER';

export type AgeGroup = 'CHILD' | 'TEEN' | 'ADULT';

export type TransitionMethod = 'AGE_POLICY' | 'MANUAL';

export interface FamilyPolicy {
  teenAge: number; // default 13, range 12-17
  adultAge: number; // default 18, range 16-21
  allowManualPromotion: boolean;
  allowTeenRole: boolean;
  calendarCreateRoles?: ('PARENT' | 'CO_PARENT' | 'ADULT_MEMBER' | 'TEEN')[]; // Opcional: roles que pueden crear eventos
}

export interface RoleTransition {
  eligibleAt?: Date;
  promotedAt?: Date;
  promotedByUid?: string;
  method?: TransitionMethod;
  fromRole?: Role;
  toRole?: Role;
  note?: string;
}

export interface AttentionMode {
  enabled: boolean;
  allowLoud: boolean;
  forcedUntil?: Timestamp;
  updatedAt: Timestamp;
  updatedByUid: string;
}

export interface DeviceToken {
  token: string;
  updatedAt: Timestamp;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  activeFamilyId?: string;
  deviceTokens?: {
    ios?: DeviceToken;
    android?: DeviceToken;
  };
  deviceReady?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
  familyPolicy: FamilyPolicy;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FamilyMember {
  uid: string;
  familyId: string;
  role: Role;
  birthYear?: number;
  ageGroup?: AgeGroup; // DERIVED, not editable
  isMinor?: boolean; // DERIVED, not editable
  attentionMode?: AttentionMode;
  transition?: RoleTransition;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface AttentionRequest {
  id: string;
  familyId: string;
  targetUid: string;
  triggeredByUid: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  intensity: 'normal' | 'loud';
  durationSec: 15 | 30 | 60;
  message?: string;
  status: 'active' | 'acknowledged' | 'cancelled' | 'expired' | 'failed';
  ackAt?: Timestamp;
  cancelledAt?: Timestamp;
  failReason?: string;
  rateKey: string;
}

export interface AuditLog {
  id: string;
  familyId: string;
  action: string;
  actorUid: string;
  targetUid?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// ============================================
// FASE 2: Core Daily Use Types
// ============================================

export interface TaskSchedule {
  frequency: 'one_time' | 'daily' | 'weekly' | 'monthly';
  dueDate?: Timestamp; // Solo si frequency == 'one_time'
  daysOfWeek?: number[]; // Para weekly: [1,3,5] = lunes, miércoles, viernes
  dayOfMonth?: number; // Para monthly
}

export interface Task {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  isActive: boolean;
  schedule?: TaskSchedule;
  points?: number; // Puntos por completar
  amountCents?: number; // Cents de mesada por completar (alternativa a points)
  requiresApproval: boolean; // Si requiere aprobación de PARENT/CO_PARENT
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaskCompletion {
  id: string;
  familyId: string;
  taskId: string; // Referencia a task
  memberUid: string; // Quien completó
  periodKey: string; // Evita duplicados por periodo
  // Format: one_time="once", daily="YYYY-MM-DD", weekly="YYYY-Www", monthly="YYYY-MM"
  completedAt: Timestamp;
  status: 'pending_approval' | 'approved' | 'rejected';
  approvedBy?: string; // UID de quien aprobó
  approvedAt?: Timestamp;
  rejectedAt?: Timestamp;
  rejectionReason?: string;
  pointsAwarded?: number;
  amountCentsAwarded?: number;
  createdBy: string;
  createdAt: Timestamp;
  // NO updatedAt (inmutable excepto por Functions)
}

export interface AllowanceLedgerEntry {
  id: string;
  familyId: string;
  memberUid: string;
  amountCents?: number; // Opcional (al menos uno de amountCents o points requerido)
  points?: number; // Opcional (al menos uno de amountCents o points requerido)
  type: 'credit' | 'debit';
  source: 'task_completion' | 'manual' | 'penalty' | 'adjustment';
  sourceId?: string; // ID del task_completion, penalty, etc.
  description: string;
  entryDate: Timestamp;
  createdBy: string;
  createdAt: Timestamp;
  // NO updatedAt (ledger inmutable)
}

export interface CalendarEvent {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  isAllDay: boolean;
  visibility: 'family' | 'parents_only';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

