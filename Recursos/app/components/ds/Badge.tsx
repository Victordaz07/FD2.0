/**
 * Badge Component
 * Mobile-first label/tag component with semantic variants
 * React Native compatible structure
 */

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "../ui/utils";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "info";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: `
    bg-neutral-100 text-neutral-700 border-neutral-200
  `,
  primary: `
    bg-indigo-100 text-indigo-700 border-indigo-200
  `,
  success: `
    bg-emerald-100 text-emerald-700 border-emerald-200
  `,
  warning: `
    bg-amber-100 text-amber-700 border-amber-200
  `,
  error: `
    bg-rose-100 text-rose-700 border-rose-200
  `,
  info: `
    bg-sky-100 text-sky-700 border-sky-200
  `,
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dot = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center gap-1",
          "font-medium rounded-md border",
          "whitespace-nowrap",
          
          // Variant styles
          badgeVariants[variant],
          
          // Size styles
          badgeSizes[size],
          
          className
        )}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
