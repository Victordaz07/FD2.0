import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { AttentionRequest, AttentionMode } from '@/lib/types';
import { getAttentionMode } from '@/lib/db/attentionMode';
import {
  sendAttentionRequest,
  ackAttentionRequest,
  cancelAttentionRequest,
  setAttentionMode as setAttentionModeFunction,
} from '@/lib/functions/attentionFunctions';

interface AttentionState {
  attentionMode: AttentionMode | null;
  activeRequest: AttentionRequest | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadAttentionMode: (familyId: string, uid: string) => Promise<void>;
  setAttentionMode: (familyId: string, enabled: boolean, allowLoud: boolean) => Promise<void>;
  sendRequest: (
    familyId: string,
    targetUid: string,
    intensity: 'normal' | 'loud',
    durationSec: 15 | 30 | 60,
    message?: string
  ) => Promise<void>;
  ack: (familyId: string, requestId: string) => Promise<void>;
  cancel: (familyId: string, requestId: string) => Promise<void>;
  setActiveRequest: (request: AttentionRequest | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAttentionStore = create<AttentionState>((set, get) => ({
  attentionMode: null,
  activeRequest: null,
  loading: false,
  error: null,

  loadAttentionMode: async (familyId: string, uid: string) => {
    set({ loading: true, error: null });
    try {
      const mode = await getAttentionMode(familyId, uid);
      // Ensure mode has valid boolean values if it exists
      if (mode) {
        // Double-check that values are boolean (defensive programming)
        const safeMode = {
          ...mode,
          enabled: Boolean(mode.enabled),
          allowLoud: Boolean(mode.allowLoud),
        };
        set({ attentionMode: safeMode, loading: false });
      } else {
        set({ attentionMode: null, loading: false });
      }
    } catch (error: any) {
      console.error('Error loading attention mode:', error);
      set({ error: error.message || 'Error al cargar el modo de atención', loading: false, attentionMode: null });
    }
  },

  setAttentionMode: async (familyId: string, enabled: boolean, allowLoud: boolean) => {
    set({ loading: true, error: null });
    try {
      await setAttentionModeFunction(familyId, enabled, allowLoud);
      // Reload attention mode after update
      const { user } = await import('@/store/authStore').then(m => m.useAuthStore.getState());
      if (user?.uid) {
        await get().loadAttentionMode(familyId, user.uid);
      }
    } catch (error: any) {
      set({ error: error.message || 'Error al actualizar el modo de atención', loading: false });
      throw error;
    }
  },

  sendRequest: async (
    familyId: string,
    targetUid: string,
    intensity: 'normal' | 'loud',
    durationSec: 15 | 30 | 60,
    message?: string
  ) => {
    set({ loading: true, error: null });
    try {
      await sendAttentionRequest(familyId, targetUid, intensity, durationSec, message);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error al enviar solicitud', loading: false });
      throw error;
    }
  },

  ack: async (familyId: string, requestId: string) => {
    set({ loading: true, error: null });
    try {
      await ackAttentionRequest(familyId, requestId);
      // Update activeRequest status if it matches
      const { activeRequest } = get();
      if (activeRequest && activeRequest.id === requestId) {
        set({
          activeRequest: {
            ...activeRequest,
            status: 'acknowledged',
            ackAt: Timestamp.now(),
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Error al reconocer la solicitud', loading: false });
      throw error;
    }
  },

  cancel: async (familyId: string, requestId: string) => {
    set({ loading: true, error: null });
    try {
      await cancelAttentionRequest(familyId, requestId);
      // Update activeRequest status if it matches
      const { activeRequest } = get();
      if (activeRequest && activeRequest.id === requestId) {
        set({
          activeRequest: {
            ...activeRequest,
            status: 'cancelled',
            cancelledAt: Timestamp.now(),
          },
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Error al cancelar la solicitud', loading: false });
      throw error;
    }
  },

  setActiveRequest: (request: AttentionRequest | null) => {
    set({ activeRequest: request });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

