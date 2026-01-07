/**
 * FormField - Campo de formulario
 */

import { cn } from "@/components/ui/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        
        <input
          ref={ref}
          className={cn(
            "w-full h-12 px-4 rounded-xl border bg-white",
            "text-base text-neutral-900 placeholder:text-neutral-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
              : "border-neutral-200 focus:border-indigo-500 focus:ring-indigo-500",
            props.disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed",
            className
          )}
          {...props}
        />
        
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

FormField.displayName = "FormField";

