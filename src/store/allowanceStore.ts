import { create } from 'zustand';
import { AllowanceLedgerEntry } from '@/lib/types';

interface AllowanceState {
  entries: AllowanceLedgerEntry[];
  balance: { amountCents: number; points: number };
  loading: boolean;
  error: string | null;
  setEntries: (entries: AllowanceLedgerEntry[]) => void;
  setBalance: (balance: { amountCents: number; points: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAllowanceStore = create<AllowanceState>((set) => ({
  entries: [],
  balance: { amountCents: 0, points: 0 },
  loading: false,
  error: null,
  setEntries: (entries) => set({ entries }),
  setBalance: (balance) => set({ balance }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

