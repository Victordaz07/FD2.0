import { create } from 'zustand';
import { CalendarEvent } from '@/lib/types';

interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  setEvents: (events: CalendarEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  loading: false,
  error: null,
  setEvents: (events) => set({ events }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

