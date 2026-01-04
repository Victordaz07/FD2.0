/**
 * Helper functions for Attention Ring operations
 */

import * as admin from 'firebase-admin';

/**
 * Calculate 10-minute window key for rate limiting
 * Format: YYYYMMDDHHmm (rounded down to 10-minute bucket)
 * Example: 202601041430 -> 202601041430 (1:30 PM)
 *          202601041435 -> 202601041430 (1:35 PM rounds to 1:30 PM)
 */
export function calculateRateLimitWindowKey(timestamp: admin.firestore.Timestamp): string {
  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  
  // Round down to 10-minute bucket (0, 10, 20, 30, 40, 50)
  const roundedMinutes = Math.floor(minutes / 10) * 10;
  
  return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hour.toString().padStart(2, '0')}${roundedMinutes.toString().padStart(2, '0')}`;
}

/**
 * Calculate expiresAt timestamp from durationSec
 */
export function calculateExpiresAt(durationSec: 15 | 30 | 60): admin.firestore.Timestamp {
  const now = admin.firestore.Timestamp.now();
  const expiresAtSeconds = now.seconds + durationSec;
  return admin.firestore.Timestamp.fromMillis(expiresAtSeconds * 1000);
}

