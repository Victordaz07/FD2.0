import { Plus, Filter, Search, CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { IconBadge } from "../components/IconBadge";
import { PremiumCard } from "../components/PremiumCard";
import { AddTaskModal, TaskData } from "../components/AddTaskModal";

export function TasksScreen() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleTaskSubmit = (task: TaskData) => {
    console.log("New task:", task);
  };

  const taskStats = [
    { label: "Total", value: 49, color: "bg-slate-100 text-slate-700" },
    { label: "Completed", value: 41, color: "bg-emerald-100 text-emerald-700" },
    { label: "Pending", value: 8, color: "bg-amber-100 text-amber-700" },
  ];

  const tasks = [
    { 
      id: 1, 
      title: "Clean bedroom", 
      assignee: { name: "Emma", avatar: "👧" },
      priority: "high", 
      dueDate: "Today, 9:00 AM",
      status: "pending",
      category: "Home"
    },
    { 
      id: 2, 
      title: "Homework - Math", 
      assignee: { name: "Jake", avatar: "👦" },
      priority: "high", 
      dueDate: "Today, 2:00 PM",
      status: "pending",
      category: "Education"
    },
    { 
      id: 3, 
      title: "Water plants", 
      assignee: { name: "Mom", avatar: "👩" },
      priority: "medium", 
      dueDate: "Today, 10:00 AM",
      status: "completed",
      category: "Home"
    },
    { 
      id: 4, 
      title: "Grocery shopping", 
      assignee: { name: "Dad", avatar: "👨" },
      priority: "medium", 
      dueDate: "Tomorrow, 5:00 PM",
      status: "pending",
      category: "Errands"
    },
    { 
      id: 5, 
      title: "Practice piano", 
      assignee: { name: "Emma", avatar: "👧" },
      priority: "low", 
      dueDate: "Tomorrow, 3:00 PM",
      status: "pending",
      category: "Education"
    },
  ];

  const filters = [
    { id: "all", label: "All Tasks", count: 49 },
    { id: "pending", label: "Pending", count: 8 },
    { id: "completed", label: "Completed", count: 41 },
  ];

  return (
    <div className="min-h-screen pb-20">
      <AppHeader 
        title="Tasks" 
        subtitle="Manage family tasks"
        action={
          <Button 
            size="sm"
            onClick={() => setShowTaskModal(true)}
            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-lg"
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
            {taskStats.map((stat, index) => (
              <PremiumCard key={index} className="text-center">
                <p className="text-2xl font-semibold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Search & Filter */}
        <section className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search tasks..."
              className="pl-10 h-11 border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
                  ${activeFilter === filter.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                {filter.label}
                <span className={`ml-2 ${activeFilter === filter.id ? "text-indigo-200" : "text-slate-400"}`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Tasks by Priority */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-rose-600" strokeWidth={2.5} />
            <h3 className="text-sm font-semibold text-slate-900">High Priority</h3>
            <Badge className="bg-rose-100 text-rose-700 border-rose-200 border text-xs">2</Badge>
          </div>
          <div className="space-y-2.5">
            {tasks.filter(t => t.priority === "high").map((task) => (
              <PremiumCard key={task.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={task.status === "completed"}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      readOnly
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className={`font-medium text-sm ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                        {task.title}
                      </p>
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200 border text-xs px-2 py-0.5 flex-shrink-0">
                        High
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{task.assignee.avatar}</span>
                        <span>{task.assignee.name}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Medium Priority */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
            <h3 className="text-sm font-semibold text-slate-900">Medium Priority</h3>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs">2</Badge>
          </div>
          <div className="space-y-2.5">
            {tasks.filter(t => t.priority === "medium").map((task) => (
              <PremiumCard key={task.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={task.status === "completed"}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      readOnly
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className={`font-medium text-sm ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                        {task.title}
                      </p>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-xs px-2 py-0.5 flex-shrink-0">
                        Medium
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{task.assignee.avatar}</span>
                        <span>{task.assignee.name}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>

        {/* Low Priority */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
            <h3 className="text-sm font-semibold text-slate-900">Low Priority</h3>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-xs">1</Badge>
          </div>
          <div className="space-y-2.5">
            {tasks.filter(t => t.priority === "low").map((task) => (
              <PremiumCard key={task.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={task.status === "completed"}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                      readOnly
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className={`font-medium text-sm ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                        {task.title}
                      </p>
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 border text-xs px-2 py-0.5 flex-shrink-0">
                        Low
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{task.assignee.avatar}</span>
                        <span>{task.assignee.name}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
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
    </div>
  );
}
