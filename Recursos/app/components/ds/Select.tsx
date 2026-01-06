/**
 * Select Component
 * Mobile-first select/dropdown
 * React Native compatible structure (similar to Picker)
 */

import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../ui/utils";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  size?: SelectSize;
  label?: string;
  helperText?: string;
  error?: boolean;
}

const selectSizes: Record<SelectSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-13 px-4 text-lg",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = "md",
      label,
      helperText,
      error = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              "w-full rounded-lg border bg-white",
              "font-normal text-neutral-900",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "appearance-none cursor-pointer",
              
              // Size styles
              selectSizes[size],
              "pr-10", // Space for chevron
              
              // State styles
              error 
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                : "border-neutral-200 focus:border-indigo-500 focus:ring-indigo-500",
              
              // Disabled
              disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed",
              
              className
            )}
            {...props}
          >
            {children}
          </select>
          
          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        
        {helperText && (
          <p className={cn(
            "mt-1.5 text-sm",
            error ? "text-rose-600" : "text-neutral-500"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
