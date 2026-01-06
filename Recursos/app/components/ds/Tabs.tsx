/**
 * Tabs Component
 * Mobile-first tabs with sliding indicator
 * React Native compatible structure
 */

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../ui/utils";

export interface Tab {
  id: string;
  label: string;
  badge?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onTabChange: (id: string) => void;
  variant?: "default" | "pills" | "underline";
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeId,
  onTabChange,
  variant = "default",
  fullWidth = false,
  className,
}: TabsProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeId);

  if (variant === "pills") {
    return (
      <div className={cn(
        "flex gap-2 p-1 bg-neutral-100 rounded-lg",
        fullWidth && "w-full",
        className
      )}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all relative",
                isActive
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={cn(
                  "ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold",
                  isActive ? "bg-indigo-100 text-indigo-700" : "bg-neutral-200 text-neutral-600"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div className={cn("relative", className)}>
        <div className={cn(
          "flex border-b border-neutral-200",
          fullWidth && "w-full"
        )}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeId;
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && onTabChange(tab.id)}
                disabled={tab.disabled}
                className={cn(
                  "px-4 py-3 font-medium text-sm transition-colors relative",
                  fullWidth && "flex-1",
                  isActive
                    ? "text-indigo-600"
                    : "text-neutral-600 hover:text-neutral-900",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-xs font-semibold",
                      isActive ? "bg-indigo-100 text-indigo-700" : "bg-neutral-200 text-neutral-600"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "flex gap-1 p-1 bg-neutral-100 rounded-lg",
      fullWidth && "w-full",
      className
    )}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all relative",
              isActive
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs font-semibold",
                  isActive ? "bg-indigo-100 text-indigo-700" : "bg-neutral-200 text-neutral-600"
                )}>
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
