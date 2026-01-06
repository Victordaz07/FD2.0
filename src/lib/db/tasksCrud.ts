/**
 * Tasks CRUD operations (v1 - Simplified)
 * For managing tasks with member assignment
 * Uses addDoc() for auto-generated IDs
 * NO direct Firestore access from UI - use these functions
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import {
  parseManagedTask,
  ManagedTask,
  TaskStatus,
} from './parsers/taskParser';

// Re-export types for convenience
export type { ManagedTask, TaskStatus } from './parsers/taskParser';

const COLLECTION = (familyId: string) => `families/${familyId}/tasks`;

/**
 * List all tasks of a family
 * Orders by createdAt desc, with fallback to JS sorting if Firestore orderBy fails
 */
export async function listTasks(familyId: string): Promise<ManagedTask[]> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  try {
    // Try to order by createdAt desc
    let querySnapshot;
    try {
      const q = query(
        collection(firestore, COLLECTION(familyId)),
        orderBy('createdAt', 'desc')
      );
      querySnapshot = await getDocs(q);
    } catch (orderByError: any) {
      // If orderBy fails (e.g., missing createdAt in old docs), get all and sort in JS
      console.warn('Firestore orderBy failed, sorting in JS:', orderByError);
      querySnapshot = await getDocs(
        collection(firestore, COLLECTION(familyId))
      );
    }

    const tasks = querySnapshot.docs.map((docSnap) =>
      parseManagedTask(docSnap.id, docSnap.data())
    );

    // Sort in JS as fallback (by createdAt desc, newest first)
    tasks.sort((a, b) => {
      const timeA = a.createdAt.getTime();
      const timeB = b.createdAt.getTime();
      return timeB - timeA; // Descending
    });

    return tasks;
  } catch (error: any) {
    throw new Error(
      `Error al cargar tareas: ${error.message || 'Error desconocido'}`
    );
  }
}

/**
 * Create a new task
 * Uses addDoc() for auto-generated taskId
 */
export async function createTask(
  familyId: string,
  payload: {
    title: string;
    description?: string;
    assignedToMemberId: string;
    assignedToDisplayName?: string;
    createdBy: string;
  }
): Promise<string> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  const trimmedTitle = payload.title.trim();
  if (!trimmedTitle) {
    throw new Error('El título es requerido');
  }

  if (!payload.assignedToMemberId || !payload.assignedToMemberId.trim()) {
    throw new Error('Debe asignar la tarea a un miembro');
  }

  if (!payload.createdBy || !payload.createdBy.trim()) {
    throw new Error('createdBy es requerido');
  }

  try {
    const docRef = await addDoc(
      collection(firestore, COLLECTION(familyId)),
      {
        familyId: familyId,
        title: trimmedTitle,
        description: payload.description?.trim() || null,
        assignedToMemberId: payload.assignedToMemberId,
        assignedToDisplayName:
          payload.assignedToDisplayName?.trim() || null,
        status: 'ACTIVE',
        isActive: true,
        createdBy: payload.createdBy,
        createdAt: serverTimestamp(), // Always set for ordering
        updatedAt: serverTimestamp(),
      }
    );

    return docRef.id; // Return auto-generated taskId
  } catch (error: any) {
    throw new Error(
      `Error al crear tarea: ${error.message || 'Error desconocido'}`
    );
  }
}

/**
 * Update task (title, description, and/or assignment)
 */
export async function updateTask(
  familyId: string,
  taskId: string,
  updates: Partial<{
    title: string;
    description?: string;
    assignedToMemberId: string;
    assignedToDisplayName?: string;
  }>
): Promise<void> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  if (!taskId || !taskId.trim()) {
    throw new Error('Task ID es requerido');
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No hay cambios para actualizar');
  }

  if (updates.title !== undefined) {
    const trimmed = updates.title.trim();
    if (!trimmed) {
      throw new Error('El título no puede estar vacío');
    }
  }

  if (
    updates.assignedToMemberId !== undefined &&
    !updates.assignedToMemberId.trim()
  ) {
    throw new Error('Debe asignar la tarea a un miembro');
  }

  try {
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.title !== undefined) {
      updateData.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      updateData.description = updates.description.trim() || null;
    }

    if (updates.assignedToMemberId !== undefined) {
      updateData.assignedToMemberId = updates.assignedToMemberId;
    }

    if (updates.assignedToDisplayName !== undefined) {
      updateData.assignedToDisplayName =
        updates.assignedToDisplayName.trim() || null;
    }

    const docRef = doc(firestore, COLLECTION(familyId), taskId);
    await updateDoc(docRef, updateData);
  } catch (error: any) {
    throw new Error(
      `Error al actualizar tarea: ${error.message || 'Error desconocido'}`
    );
  }
}

/**
 * Set task status (ACTIVE or COMPLETED)
 */
export async function setTaskStatus(
  familyId: string,
  taskId: string,
  status: TaskStatus
): Promise<void> {
  if (!familyId || !familyId.trim()) {
    throw new Error('Family ID es requerido');
  }

  if (!taskId || !taskId.trim()) {
    throw new Error('Task ID es requerido');
  }

  if (status !== 'ACTIVE' && status !== 'COMPLETED') {
    throw new Error('Status inválido. Debe ser ACTIVE o COMPLETED');
  }

  try {
    const docRef = doc(firestore, COLLECTION(familyId), taskId);
    await updateDoc(docRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(
      `Error al cambiar estado: ${error.message || 'Error desconocido'}`
    );
  }
}

