import { Plus, Target, TrendingUp, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { IconBadge } from "../components/IconBadge";
import { PremiumCard } from "../components/PremiumCard";
import { AddGoalModal, GoalData } from "../components/AddGoalModal";

export function GoalsScreen() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const handleGoalSubmit = (goal: GoalData) => {
    console.log("New goal:", goal);
  };

  const categories = [
    { id: "all", name: "All Goals", count: 5 },
    { id: "education", name: "Education", icon: "📚", count: 2 },
    { id: "health", name: "Health", icon: "💪", count: 1 },
    { id: "finance", name: "Finance", icon: "💰", count: 1 },
    { id: "family", name: "Family", icon: "❤️", count: 1 },
  ];

  const goals = [
    {
      id: 1,
      title: "Read 10 books this month",
      category: "Education",
      icon: "📚",
      progress: 70,
      current: 7,
      target: 10,
      unit: "books",
      participants: ["👨", "👩", "👧"],
      deadline: "Jan 31, 2026",
      daysLeft: 27,
      color: "bg-blue-500",
      cardVariant: "info" as const,
    },
    {
      id: 2,
      title: "Exercise 4 times per week",
      category: "Health",
      icon: "💪",
      progress: 50,
      current: 2,
      target: 4,
      unit: "workouts",
      participants: ["👨", "👩"],
      deadline: "Jan 11, 2026",
      daysLeft: 7,
      color: "bg-emerald-500",
      cardVariant: "success" as const,
    },
    {
      id: 3,
      title: "Save $500 for family vacation",
      category: "Finance",
      icon: "💰",
      progress: 85,
      current: 425,
      target: 500,
      unit: "USD",
      participants: ["👨", "👩"],
      deadline: "Feb 1, 2026",
      daysLeft: 28,
      color: "bg-amber-500",
      cardVariant: "warning" as const,
    },
    {
      id: 4,
      title: "Learn 50 new Spanish words",
      category: "Education",
      icon: "📚",
      progress: 32,
      current: 16,
      target: 50,
      unit: "words",
      participants: ["👧", "👦"],
      deadline: "Jan 25, 2026",
      daysLeft: 21,
      color: "bg-blue-500",
      cardVariant: "info" as const,
    },
    {
      id: 5,
      title: "Game night every Friday",
      category: "Family",
      icon: "❤️",
      progress: 75,
      current: 3,
      target: 4,
      unit: "nights",
      participants: ["👨", "👩", "👧", "👦"],
      deadline: "Jan 31, 2026",
      daysLeft: 27,
      color: "bg-rose-500",
      cardVariant: "primary" as const,
    },
  ];

  const stats = [
    { label: "Active", value: 5, color: "text-indigo-600" },
    { label: "Completed", value: 12, color: "text-emerald-600" },
    { label: "On Track", value: 3, color: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <AppHeader 
        title="Goals" 
        subtitle="Track family goals"
        action={
          <Button 
            size="sm"
            onClick={() => setShowGoalModal(true)}
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-lg"
          >
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            New
          </Button>
        }
      />

      <main className="max-w-screen-sm mx-auto px-5 py-6 space-y-6">
        {/* Stats Overview */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <PremiumCard key={index} className="text-center">
                <p className={`text-2xl font-semibold mb-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2
                  ${activeCategory === category.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name}
                <span className={`${activeCategory === category.id ? "text-indigo-200" : "text-slate-400"}`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Goals Progress Overview */}
        <section>
          <PremiumCard variant="primary">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-indigo-600 font-medium mb-1">Overall Progress</p>
                <p className="text-2xl font-semibold text-slate-900">62%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600">
              You're making great progress! <span className="font-semibold text-slate-900">3 goals</span> are on track to be completed this month.
            </p>
          </PremiumCard>
        </section>

        {/* Active Goals */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Goals</h3>
          <div className="space-y-3">
            {goals.map((goal) => (
              <PremiumCard key={goal.id} variant={goal.cardVariant}>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{goal.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{goal.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Badge className="bg-white/80 text-slate-700 border-slate-200 border px-2 py-0.5">
                          {goal.category}
                        </Badge>
                        <span>•</span>
                        <span>{goal.daysLeft} days left</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-slate-600">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className="font-semibold text-slate-900">{goal.progress}%</span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute inset-y-0 left-0 ${goal.color} rounded-full transition-all`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {goal.participants.map((participant, index) => (
                        <div 
                          key={index}
                          className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-sm -ml-1 first:ml-0"
                        >
                          {participant}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{goal.deadline}</span>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Motivation Card */}
        <section>
          <PremiumCard variant="success" className="text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Keep Going!</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your family has completed <span className="font-semibold text-slate-900">12 goals</span> together. That's amazing teamwork!
            </p>
          </PremiumCard>
        </section>
      </main>

      <AddGoalModal 
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSubmit={handleGoalSubmit}
      />
    </div>
  );
}
