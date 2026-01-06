/**
 * SummaryCard - Tarjeta de resumen con gradiente
 */

import { LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant: 'primary' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const gradients = {
  primary: 'from-indigo-500 to-indigo-600',
  success: 'from-emerald-500 to-emerald-600',
  error: 'from-rose-500 to-rose-600',
  warning: 'from-amber-500 to-amber-600',
  info: 'from-blue-500 to-blue-600',
};

export function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant,
  className 
}: SummaryCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-2xl bg-gradient-to-br text-white shadow-md",
      gradients[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-white/70 mt-1">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
}
