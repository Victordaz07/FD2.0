import { create } from 'zustand';
import { Family, FamilyMember } from '@/lib/types';

interface FamilyState {
  currentFamily: Family | null;
  members: FamilyMember[];
  loading: boolean;
  setCurrentFamily: (family: Family | null) => void;
  setMembers: (members: FamilyMember[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  currentFamily: null,
  members: [],
  loading: false,
  setCurrentFamily: (family) => set({ currentFamily: family }),
  setMembers: (members) => set({ members }),
  setLoading: (loading) => set({ loading }),
}));

