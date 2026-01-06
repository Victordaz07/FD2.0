/**
 * ProgressBar Component
 * Mobile-first progress indicator with variants
 * React Native compatible structure
 */

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "../ui/utils";

export type ProgressVariant = "primary" | "success" | "warning" | "error";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  animated?: boolean;
}

const progressVariants: Record<ProgressVariant, string> = {
  primary: "bg-indigo-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
};

const progressSizes: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      variant = "primary",
      size = "md",
      showLabel = false,
      animated = true,
      className,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-neutral-700">Progress</span>
            <span className="text-sm font-semibold text-neutral-900">{clampedValue}%</span>
          </div>
        )}
        
        <div className={cn(
          "w-full bg-neutral-100 rounded-full overflow-hidden",
          progressSizes[size]
        )}>
          <div
            className={cn(
              "h-full rounded-full",
              progressVariants[variant],
              animated && "transition-all duration-300 ease-out"
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";
