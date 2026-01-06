import { Home, CheckSquare, Target, Trophy, Users, Settings } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "./ui/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "goals", label: "Goals", icon: Target },
  { id: "achievements", label: "Awards", icon: Trophy },
  { id: "family", label: "Family", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border z-50 safe-area-bottom">
      <div className="max-w-screen-sm mx-auto">
        <div className="grid grid-cols-6 h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 transition-all relative group"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <motion.div 
                  className={cn(
                    "w-full h-full flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all",
                    isActive && "bg-indigo-50"
                  )}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    "text-[10px] leading-tight font-medium transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"
                  )}>
                    {item.label}
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
