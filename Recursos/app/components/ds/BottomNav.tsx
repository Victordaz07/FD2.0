/**
 * BottomNav Component
 * Mobile-first bottom navigation with active states
 * React Native compatible structure (similar to BottomTabNavigator)
 */

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onItemPress: (id: string) => void;
  className?: string;
}

export function BottomNav({ items, activeId, onItemPress, className }: BottomNavProps) {
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0",
      "bg-white/80 backdrop-blur-xl",
      "border-t border-neutral-200",
      "safe-area-bottom z-50",
      className
    )}>
      <div className="max-w-screen-sm mx-auto px-2">
        <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onItemPress(item.id)}
                className="flex flex-col items-center justify-center gap-1 transition-all relative group"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <motion.div 
                  className={cn(
                    "w-full h-full flex flex-col items-center justify-center gap-1 rounded-lg transition-all",
                    isActive && "bg-indigo-50"
                  )}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-colors",
                      isActive ? "text-indigo-600" : "text-neutral-500 group-hover:text-neutral-700"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    "text-[10px] leading-tight font-medium transition-colors",
                    isActive ? "text-indigo-600" : "text-neutral-500 group-hover:text-neutral-700"
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
