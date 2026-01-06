/**
 * Input Component
 * Mobile-first text input with states
 * React Native compatible structure
 */

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../ui/utils";

export type InputSize = "sm" | "md" | "lg";
export type InputState = "default" | "error" | "success";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  state?: InputState;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const inputSizes: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-13 px-4 text-lg",
};

const inputStates: Record<InputState, string> = {
  default: `
    border-neutral-200
    focus:border-indigo-500 focus:ring-indigo-500
  `,
  error: `
    border-rose-300
    focus:border-rose-500 focus:ring-rose-500
  `,
  success: `
    border-emerald-300
    focus:border-emerald-500 focus:ring-emerald-500
  `,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      state = "default",
      label,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      className,
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
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              "w-full rounded-lg border bg-white",
              "font-normal text-neutral-900 placeholder:text-neutral-400",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              
              // Size styles
              inputSizes[size],
              
              // State styles
              inputStates[state],
              
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              
              // Disabled
              disabled && "bg-neutral-50 text-neutral-400 cursor-not-allowed",
              
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={cn(
            "mt-1.5 text-sm",
            state === "error" ? "text-rose-600" : 
            state === "success" ? "text-emerald-600" : 
            "text-neutral-500"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
