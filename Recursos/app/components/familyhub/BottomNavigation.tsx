/**
 * BottomNavigation - Navegación principal de 5 tabs
 */

import { Home, CalendarDays, Users, Building2, Menu } from "lucide-react";
import { cn } from "../ui/utils";

export type TabId = 'home' | 'plan' | 'family' | 'house' | 'more';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'home' as TabId, label: 'Inicio', icon: Home },
  { id: 'plan' as TabId, label: 'Plan', icon: CalendarDays },
  { id: 'family' as TabId, label: 'Familia', icon: Users },
  { id: 'house' as TabId, label: 'Hogar', icon: Building2 },
  { id: 'more' as TabId, label: 'Más', icon: Menu },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 safe-bottom">
      <div className="max-w-[390px] mx-auto grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center h-16 transition-colors relative",
                "active:bg-neutral-50"
              )}
            >
              <div className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-1",
                isActive && "relative"
              )}>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 rounded-full" />
                )}
                
                <Icon 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isActive ? "text-indigo-600" : "text-neutral-500"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  isActive ? "text-indigo-600" : "text-neutral-500"
                )}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
