import { Plus, TrendingUp, Clock, CheckCircle2, Target, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { IconBadge } from "../components/IconBadge";
import { PremiumCard } from "../components/PremiumCard";
import { AddTaskModal, TaskData } from "../components/AddTaskModal";
import { AddGoalModal, GoalData } from "../components/AddGoalModal";

export function HomeScreen() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const handleTaskSubmit = (task: TaskData) => {
    console.log("New task:", task);
  };

  const handleGoalSubmit = (goal: GoalData) => {
    console.log("New goal:", goal);
  };

  const familyMembers = [
    { name: "Dad", avatar: "👨", role: "Admin", tasksCompleted: 12, streak: 7, color: "bg-blue-100 text-blue-700" },
    { name: "Mom", avatar: "👩", role: "Co-Admin", tasksCompleted: 15, streak: 10, color: "bg-pink-100 text-pink-700" },
    { name: "Emma", avatar: "👧", role: "Member", tasksCompleted: 8, streak: 5, color: "bg-purple-100 text-purple-700" },
    { name: "Jake", avatar: "👦", role: "Member", tasksCompleted: 6, streak: 3, color: "bg-emerald-100 text-emerald-700" },
  ];

  const todayTasks = [
    { id: 1, title: "Clean bedroom", assignee: "Emma", priority: "high", time: "9:00 AM" },
    { id: 2, title: "Homework - Math", assignee: "Jake", priority: "high", time: "2:00 PM" },
    { id: 3, title: "Water plants", assignee: "Mom", priority: "medium", time: "10:00 AM" },
  ];

  const activeGoals = [
    { id: 1, title: "Read 10 books", progress: 70, category: "Education", icon: "📚", color: "bg-blue-500" },
    { id: 2, title: "Exercise 4x/week", progress: 50, category: "Health", icon: "💪", color: "bg-emerald-500" },
    { id: 3, title: "Save $500", progress: 85, category: "Finance", icon: "💰", color: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <AppHeader 
        title="Family Hub" 
        subtitle="Sunday, January 4, 2026"
        notificationCount={3}
      />

      <main className="max-w-screen-sm mx-auto px-5 py-6 space-y-6">
        {/* Welcome Section */}
        <section>
          <PremiumCard variant="primary" className="relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-indigo-600 font-medium mb-1">Welcome back!</p>
                  <h2 className="text-xl font-semibold text-slate-900">Good morning, Johnson Family</h2>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                You have <span className="font-semibold text-slate-900">3 tasks due today</span> and <span className="font-semibold text-slate-900">2 goals</span> in progress. Keep up the great work!
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl"></div>
          </PremiumCard>
        </section>

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            <PremiumCard className="text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-0.5">41</p>
              <p className="text-xs text-slate-500">Completed</p>
            </PremiumCard>
            
            <PremiumCard className="text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-0.5">8</p>
              <p className="text-xs text-slate-500">Pending</p>
            </PremiumCard>
            
            <PremiumCard className="text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
              </div>
              <p className="text-2xl font-semibold text-slate-900 mb-0.5">5</p>
              <p className="text-xs text-slate-500">Goals</p>
            </PremiumCard>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowTaskModal(true)}
              className="h-auto py-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex-col gap-2 rounded-xl"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-sm font-medium">Add Task</span>
            </Button>
            <Button
              onClick={() => setShowGoalModal(true)}
              className="h-auto py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex-col gap-2 rounded-xl"
            >
              <Target className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-sm font-medium">Add Goal</span>
            </Button>
          </div>
        </section>

        {/* Today's Tasks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Today's Tasks</h3>
            <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              View all
            </Button>
          </div>
          <div className="space-y-2.5">
            {todayTasks.map((task) => (
              <PremiumCard key={task.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm mb-0.5">{task.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{task.assignee}</span>
                    <span>•</span>
                    <span>{task.time}</span>
                  </div>
                </div>
                <Badge 
                  className={`
                    ${task.priority === "high" 
                      ? "bg-rose-100 text-rose-700 border-rose-200" 
                      : "bg-amber-100 text-amber-700 border-amber-200"
                    } border text-xs px-2 py-0.5
                  `}
                >
                  {task.priority === "high" ? "High" : "Medium"}
                </Badge>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Active Goals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Active Goals</h3>
            <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              View all
            </Button>
          </div>
          <div className="space-y-2.5">
            {activeGoals.map((goal) => (
              <PremiumCard key={goal.id}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{goal.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm mb-0.5">{goal.title}</p>
                    <p className="text-xs text-slate-500">{goal.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{goal.progress}%</span>
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 ${goal.color} rounded-full transition-all`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Family Members */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Family Activity</h3>
            <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              Manage
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {familyMembers.map((member, index) => (
              <PremiumCard key={index}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{member.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-500">Tasks</p>
                    <p className="font-semibold text-slate-900">{member.tasksCompleted}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Streak</p>
                    <p className="font-semibold text-slate-900">{member.streak} days</p>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>
      </main>

      <AddTaskModal 
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleTaskSubmit}
      />

      <AddGoalModal 
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSubmit={handleGoalSubmit}
      />
    </div>
  );
}
