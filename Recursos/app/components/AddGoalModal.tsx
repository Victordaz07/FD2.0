import { useState } from "react";
import { X, Target, Users, TrendingUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: GoalData) => void;
}

export interface GoalData {
  title: string;
  description: string;
  category: string;
  targetValue: string;
  unit: string;
  deadline: string;
  participants: string[];
}

const categories = [
  { id: "education", name: "Education", icon: "📚", color: "border-blue-200 bg-blue-50" },
  { id: "health", name: "Health", icon: "💪", color: "border-emerald-200 bg-emerald-50" },
  { id: "finance", name: "Finance", icon: "💰", color: "border-amber-200 bg-amber-50" },
  { id: "family", name: "Family", icon: "❤️", color: "border-rose-200 bg-rose-50" },
];

const familyMembers = [
  { id: "dad", name: "Dad", avatar: "👨" },
  { id: "mom", name: "Mom", avatar: "👩" },
  { id: "emma", name: "Emma", avatar: "👧" },
  { id: "jake", name: "Jake", avatar: "👦" },
];

export function AddGoalModal({ isOpen, onClose, onSubmit }: AddGoalModalProps) {
  const [formData, setFormData] = useState<GoalData>({
    title: "",
    description: "",
    category: "",
    targetValue: "",
    unit: "",
    deadline: "",
    participants: [],
  });

  const toggleParticipant = (id: string) => {
    setFormData({
      ...formData,
      participants: formData.participants.includes(id)
        ? formData.participants.filter((p) => p !== id)
        : [...formData.participants, id],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      category: "",
      targetValue: "",
      unit: "",
      deadline: "",
      participants: [],
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Create Goal</h2>
                    <p className="text-sm text-slate-500">Set a goal to achieve together</p>
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
              {/* Goal Title */}
              <div className="space-y-2">
                <Label htmlFor="goalTitle">Goal Title</Label>
                <Input
                  id="goalTitle"
                  placeholder="e.g., Read 10 books this month"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-2.5">
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                        ${formData.category === cat.id
                          ? cat.color + " shadow-sm scale-105"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">Target</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    placeholder="10"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    required
                    className="h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="books"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="goalDescription">Description (optional)</Label>
                <Textarea
                  id="goalDescription"
                  placeholder="Why is this goal important?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  className="h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Participants */}
              <div className="space-y-2.5">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Who's participating?
                </Label>
                <div className="grid grid-cols-4 gap-2.5">
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleParticipant(member.id)}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all relative
                        ${formData.participants.includes(member.id)
                          ? "border-emerald-500 bg-emerald-50 shadow-sm scale-105"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      <div className="text-2xl">{member.avatar}</div>
                      <span className="text-xs font-medium text-slate-700">{member.name}</span>
                      {formData.participants.includes(member.id) && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
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
                  disabled={
                    !formData.title ||
                    !formData.category ||
                    !formData.targetValue ||
                    !formData.unit ||
                    !formData.deadline
                  }
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Create Goal
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
