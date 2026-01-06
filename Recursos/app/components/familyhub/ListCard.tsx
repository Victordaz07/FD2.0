/**
 * ListCard - Tarjeta para listas
 */

import { ChevronRight } from "lucide-react";
import { cn } from "../ui/utils";
import { ReactNode } from "react";

interface ListCardProps {
  title: string;
  subtitle?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function ListCard({
  title,
  subtitle,
  leftContent,
  rightContent,
  onClick,
  showChevron = false,
  className,
}: ListCardProps) {
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white p-4 rounded-2xl border border-neutral-200 transition-all",
        isClickable && "cursor-pointer hover:shadow-md active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {leftContent && (
          <div className="flex-shrink-0">
            {leftContent}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 truncate">{title}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
        
        {rightContent && (
          <div className="flex-shrink-0">
            {rightContent}
          </div>
        )}
        
        {showChevron && (
          <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
