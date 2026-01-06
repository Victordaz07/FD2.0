/**
 * SelectField - Campo select (siempre valores string)
 */

import { ChevronDown } from "lucide-react";
import { cn } from "../ui/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, helperText, className, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full h-12 pl-4 pr-10 rounded-xl border bg-white",
              "text-base text-neutral-900",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "appearance-none cursor-pointer",
              error
                ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                : "border-neutral-200 focus:border-indigo-500 focus:ring-indigo-500",
              props.disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed",
              className
            )}
            {...props}
          >
            {children}
          </select>
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-rose-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
