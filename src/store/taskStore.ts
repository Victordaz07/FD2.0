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
    // Normalize boolean values to ensure they are ALWAYS boolean
    // This is a safety layer to prevent String values from reaching native components
    const normalizedTasks = tasks.map((task) => ({
      ...task,
      // Force boolean conversion - double safety layer
      isActive: Boolean(toBool(task.isActive, false)),
      requiresApproval: Boolean(toBool(task.requiresApproval, false)),
    }));
    set({ tasks: normalizedTasks });
  },
  setCompletions: (completions) => set({ completions }),
  setPendingApprovals: (pendingApprovals) => set({ pendingApprovals }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

