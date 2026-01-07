/**
 * AppHeader - Header de aplicación con botón +
 */

import { Plus } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
  className?: string;
}

export function AppHeader({
  title,
  subtitle,
  onAddClick,
  showAddButton = true,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-neutral-200",
        className
      )}
    >
      <div className="max-w-[390px] mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-neutral-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-neutral-500 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="ml-3 w-10 h-10 rounded-xl bg-primary-main flex items-center justify-center text-white hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
            style={{ backgroundColor: "#4F46E5" }}
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </header>
  );
}
