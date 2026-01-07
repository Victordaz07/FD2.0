import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      clearAuth: () => set({ user: null, loading: false }),
    }),
    {
      name: 'auth-storage', // nombre único para el storage
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir el usuario, no el estado de loading
      partialize: (state) => ({ user: state.user }),
    }
  )
);


