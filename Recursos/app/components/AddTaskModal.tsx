import { useState } from "react";
import { X, User, Calendar, Flag, Camera, Video, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
}

export interface TaskData {
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const familyMembers = [
  { id: "dad", name: "Dad", avatar: "👨", color: "bg-blue-100 text-blue-700" },
  { id: "mom", name: "Mom", avatar: "👩", color: "bg-pink-100 text-pink-700" },
  { id: "emma", name: "Emma", avatar: "👧", color: "bg-purple-100 text-purple-700" },
  { id: "jake", name: "Jake", avatar: "👦", color: "bg-emerald-100 text-emerald-700" },
];

export function AddTaskModal({ isOpen, onClose, onSubmit }: AddTaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Create Task</h2>
                    <p className="text-sm text-slate-500">Add a new task for your family</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-110px)]">
              {/* Task Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Clean the garage"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Assign To */}
              <div className="space-y-2.5">
                <Label>Assign To</Label>
                <div className="grid grid-cols-4 gap-2.5">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, assignee: member.id })}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                        ${formData.assignee === member.id
                          ? "border-indigo-500 bg-indigo-50 shadow-sm scale-105"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      <div className="text-2xl">{member.avatar}</div>
                      <span className="text-xs font-medium text-slate-700">{member.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: "low", label: "Low", color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
                      { value: "medium", label: "Medium", color: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100" },
                      { value: "high", label: "High", color: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" },
                    ].map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: priority.value as any })}
                        className={`
                          py-2 px-3 rounded-lg border-2 font-medium transition-all text-sm
                          ${formData.priority === priority.value
                            ? priority.color + " shadow-sm scale-105"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                          }
                        `}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-11 border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.title || !formData.assignee || !formData.dueDate}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  Create Task
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
