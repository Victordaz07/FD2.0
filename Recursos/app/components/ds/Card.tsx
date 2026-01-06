/**
 * Card Component
 * Mobile-first container with variants
 * React Native compatible structure (similar to View + styles)
 */

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "../ui/utils";

export type CardVariant = "default" | "elevated" | "outlined" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  pressable?: boolean;
  active?: boolean;
}

const cardVariants: Record<CardVariant, string> = {
  default: `
    bg-white
    border border-neutral-200
    shadow-sm
  `,
  elevated: `
    bg-white
    shadow-md
    border-none
  `,
  outlined: `
    bg-white
    border-2 border-neutral-200
    shadow-none
  `,
  ghost: `
    bg-neutral-50
    border-none
    shadow-none
  `,
};

const cardPadding: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      pressable = false,
      active = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-lg",
          "transition-all duration-200",
          
          // Variant styles
          cardVariants[variant],
          
          // Padding
          cardPadding[padding],
          
          // Pressable
          pressable && "cursor-pointer hover:shadow-md active:scale-[0.99]",
          
          // Active state
          active && "ring-2 ring-indigo-500 border-indigo-500",
          
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
