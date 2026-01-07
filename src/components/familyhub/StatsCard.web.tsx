/**
 * StatsCard - Card de estadísticas para Dashboard
 */

import { LucideIcon } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface StatsCardProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo';
  onClick?: () => void;
  className?: string;
}

const colorStyles = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  rose: 'from-rose-500 to-rose-600',
  indigo: 'from-indigo-500 to-indigo-600',
};

export function StatsCard({
  icon: Icon,
  emoji,
  title,
  value,
  subtitle,
  color = 'indigo',
  onClick,
  className,
}: StatsCardProps) {
  const Component = onClick ? 'button' : 'div';
  
  // Ensure either icon or emoji is provided
  if (!Icon && !emoji) {
    console.warn('StatsCard: Either icon or emoji must be provided');
  }
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        "p-4 rounded-2xl bg-gradient-to-br text-white shadow-md",
        colorStyles[color],
        onClick && "hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-white/70 mt-1">{subtitle}</p>
          )}
        </div>
        
        {emoji ? (
          <div className="text-3xl flex-shrink-0 ml-2">{emoji}</div>
        ) : Icon ? (
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 ml-2">
            <Icon className="w-6 h-6" strokeWidth={2.5} />
          </div>
        ) : null}
      </div>
    </Component>
  );
}

