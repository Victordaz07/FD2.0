/**
 * HubCard - Card grande para hubs (Plan, Familia, Hogar)
 */

import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "../ui/utils";

interface HubCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value?: string | number;
  progress?: number;
  badge?: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  onClick: () => void;
  className?: string;
}

const colorStyles = {
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    progressBg: 'bg-blue-500',
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    progressBg: 'bg-purple-500',
  },
  emerald: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    progressBg: 'bg-emerald-500',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    progressBg: 'bg-amber-500',
  },
  rose: {
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    progressBg: 'bg-rose-500',
  },
};

export function HubCard({
  icon: Icon,
  title,
  description,
  value,
  progress,
  badge,
  color = 'blue',
  onClick,
  className,
}: HubCardProps) {
  const styles = colorStyles[color];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-white p-5 rounded-2xl border border-neutral-200",
        "hover:shadow-md active:scale-[0.99] transition-all",
        "text-left",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          styles.iconBg
        )}>
          <Icon className={cn("w-7 h-7", styles.iconColor)} strokeWidth={2} />
        </div>
        
        <ChevronRight className="w-6 h-6 text-neutral-400 flex-shrink-0" />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-neutral-500 mb-3">
        {description}
      </p>
      
      <div className="flex items-center justify-between">
        {value !== undefined && (
          <div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            {badge && (
              <span className="text-xs text-neutral-500">{badge}</span>
            )}
          </div>
        )}
        
        {progress !== undefined && (
          <div className="flex-1 ml-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-neutral-600">Progreso</span>
              <span className="text-xs font-bold text-neutral-900">{progress}%</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all", styles.progressBg)}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
