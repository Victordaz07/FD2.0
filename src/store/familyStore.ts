import { create } from 'zustand';
import { Family, FamilyMember } from '@/lib/types';
import { toBool } from '@/lib/helpers/booleanHelpers';

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
  setMembers: (members) => {
    // TEMPORARILY DISABLED - Remove attentionMode to prevent crashes
    // TODO: Re-enable once boolean casting issues are resolved
    const safeMembers = members.map((member) => {
      // Remove attentionMode to prevent String->Boolean casting errors
      const { attentionMode, ...memberWithoutAttentionMode } = member;
      return memberWithoutAttentionMode;
    });
    set({ members: safeMembers });
    
    /* ORIGINAL CODE - COMMENTED OUT TEMPORARILY
    // Normalize attentionMode values to ensure they are ALWAYS boolean
    // This is a safety layer to prevent String values from reaching native components
    const normalizedMembers = members.map((member) => {
      if (member.attentionMode) {
        return {
          ...member,
          attentionMode: {
            ...member.attentionMode,
            // Force boolean conversion - double safety layer
            enabled: Boolean(toBool(member.attentionMode.enabled, false)),
            allowLoud: Boolean(toBool(member.attentionMode.allowLoud, false)),
          },
        };
      }
      return member;
    });
    set({ members: normalizedMembers });
    */
  },
  setLoading: (loading) => set({ loading }),
}));


