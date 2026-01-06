/**
 * EmptyState - Estado vacío
 */

import { LucideIcon } from "lucide-react";
import { cn } from "../ui/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-6",
      className
    )}>
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400" strokeWidth={2} />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-neutral-500 max-w-xs mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 h-12 rounded-xl font-medium text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
          style={{ backgroundColor: '#4F46E5' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
