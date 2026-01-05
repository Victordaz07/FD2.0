import { create } from 'zustand';
import { Task, TaskCompletion } from '@/lib/types';
import { toBool } from '@/lib/helpers/booleanHelpers';

interface TaskState {
  tasks: Task[];
  completions: TaskCompletion[];
  pendingApprovals: TaskCompletion[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setCompletions: (completions: TaskCompletion[]) => void;
  setPendingApprovals: (approvals: TaskCompletion[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  completions: [],
  pendingApprovals: [],
  loading: false,
  error: null,
  setTasks: (tasks) => {
    set({ tasks });
  },
  setCompletions: (completions) => set({ completions }),
  setPendingApprovals: (pendingApprovals) => set({ pendingApprovals }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

