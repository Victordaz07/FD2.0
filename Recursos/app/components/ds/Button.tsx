/**
 * Button Component
 * Mobile-first design with clear variants and states
 * React Native compatible structure
 */

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "../ui/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: `
    bg-indigo-600 text-white
    hover:bg-indigo-700 active:bg-indigo-800
    disabled:bg-neutral-200 disabled:text-neutral-400
    shadow-sm
  `,
  secondary: `
    bg-neutral-100 text-neutral-900
    hover:bg-neutral-200 active:bg-neutral-300
    disabled:bg-neutral-100 disabled:text-neutral-300
  `,
  outline: `
    bg-transparent border-2 border-neutral-200 text-neutral-700
    hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100
    disabled:border-neutral-200 disabled:text-neutral-300
  `,
  ghost: `
    bg-transparent text-neutral-700
    hover:bg-neutral-100 active:bg-neutral-200
    disabled:text-neutral-300
  `,
  danger: `
    bg-rose-600 text-white
    hover:bg-rose-700 active:bg-rose-800
    disabled:bg-neutral-200 disabled:text-neutral-400
    shadow-sm
  `,
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2",
          "font-medium rounded-lg",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          "disabled:cursor-not-allowed",
          
          // Variant styles
          buttonVariants[variant],
          
          // Size styles
          buttonSizes[size],
          
          // Full width
          fullWidth && "w-full",
          
          // Active scale effect
          !isDisabled && "active:scale-[0.98]",
          
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !loading && leftIcon}
        {children}
        {rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
