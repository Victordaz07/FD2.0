/**
 * Members CRUD operations
 * For managing family members (manual profiles without login)
 * Uses addDoc() for auto-generated IDs
 * NO direct Firestore access from UI - use these functions
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import {
  parseManagedMember,
  ManagedMember,
  ManagedRole,
} from './parsers/memberParser';

// Re-export types for convenience
export type { ManagedMember, ManagedRole } from './parsers/memberParser';

const COLLECTION = (familyId: string) => `families/${familyId}/members`;

/**
 * List all members of a family
 */
export async function listMembers(familyId: string): Promise<ManagedMember[]> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  try {
    const querySnapshot = await getDocs(
      collection(firestore, COLLECTION(familyId))
    );

    return querySnapshot.docs.map((docSnap) =>
      parseManagedMember(docSnap.id, docSnap.data())
    );
  } catch (error: any) {
    throw new Error(
      `Error al cargar miembros: ${error.message || 'Error desconocido'}`
    );
  }
}

/**
 * Create a new member (manual profile)
 * Uses addDoc() for auto-generated memberId
 */
export async function createMember(
  familyId: string,
  payload: {
    displayName: string;
    role: ManagedRole;
    createdBy: string;
    uid?: string; // Optional - only if member has login
  }
): Promise<string> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  const trimmedName = payload.displayName.trim();
  if (!trimmedName) {
    throw new Error('El nombre es requerido');
  }

  // Validate role
  if (!['PARENT', 'TEEN', 'CHILD'].includes(payload.role)) {
    throw new Error('Rol inválido. Debe ser PARENT, TEEN o CHILD');
  }

  if (!payload.createdBy || !payload.createdBy.trim()) {
    throw new Error('createdBy es requerido');
  }

  try {
    const docRef = await addDoc(
      collection(firestore, COLLECTION(familyId)),
      {
        familyId: familyId, // Store familyId in document
        displayName: trimmedName,
        role: payload.role,
        uid: payload.uid || null,
        isActive: true, // Default active
        createdBy: payload.createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return docRef.id; // Return auto-generated memberId
  } catch (error: any) {
    throw new Error(
      `Error al crear miembro: ${error.message || 'Error desconocido'}`
    );
  }
}

/**
 * Update member (displayName and/or role)
 */
export async function updateMember(
  familyId: string,
  memberId: string,
  updates: Partial<{
    displayName: string;
    role: ManagedRole;
  }>
): Promise<void> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  if (!memberId || !memberId.trim()) {
    throw new Error('Member ID es requerido');
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No hay cambios para actualizar');
  }

  if (updates.displayName !== undefined) {
    const trimmed = updates.displayName.trim();
    if (!trimmed) {
      throw new Error('El nombre no puede estar vacío');
    }
  }

  if (updates.role !== undefined) {
    if (!['PARENT', 'TEEN', 'CHILD'].includes(updates.role)) {
      throw new Error('Rol inválido. Debe ser PARENT, TEEN o CHILD');
    }
  }

  try {
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.displayName !== undefined) {
      updateData.displayName = updates.displayName.trim();
    }

    if (updates.role !== undefined) {
      updateData.role = updates.role;
    }

    const docRef = doc(firestore, COLLECTION(familyId), memberId);
    await updateDoc(docRef, updateData);
  } catch (error: any) {
    throw new Error(
      `Error al actualizar miembro: ${error.message || 'Error desconocido'}`
    );
  }
}

/**
 * Toggle member active/inactive status
 */
export async function toggleMemberActive(
  familyId: string,
  memberId: string,
  current: boolean
): Promise<void> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  if (!memberId || !memberId.trim()) {
    throw new Error('Member ID es requerido');
  }

  try {
    const docRef = doc(firestore, COLLECTION(familyId), memberId);
    await updateDoc(docRef, {
      isActive: !current,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(
      `Error al cambiar estado: ${error.message || 'Error desconocido'}`
    );
  }
}
