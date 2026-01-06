/**
 * Toggle Component
 * Mobile-first toggle switch
 * React Native compatible structure (similar to Switch)
 */

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../ui/utils";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: ToggleSize;
  label?: string;
  description?: string;
}

const toggleSizes = {
  sm: {
    track: "w-9 h-5",
    thumb: "w-4 h-4",
    translate: "translate-x-4",
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-5 h-5",
    translate: "translate-x-5",
  },
  lg: {
    track: "w-14 h-7",
    thumb: "w-6 h-6",
    translate: "translate-x-7",
  },
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      size = "md",
      label,
      description,
      checked,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const sizes = toggleSizes[size];

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <label className={cn(
          "relative inline-flex cursor-pointer",
          disabled && "cursor-not-allowed opacity-50"
        )}>
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          
          {/* Track */}
          <div className={cn(
            "rounded-full transition-colors duration-200",
            sizes.track,
            "bg-neutral-200",
            "peer-checked:bg-indigo-600",
            "peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2",
            disabled && "peer-checked:bg-neutral-300"
          )} />
          
          {/* Thumb */}
          <div className={cn(
            "absolute top-0.5 left-0.5",
            "bg-white rounded-full shadow-sm",
            "transition-transform duration-200",
            sizes.thumb,
            checked && sizes.translate
          )} />
        </label>
        
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <p className="text-sm font-medium text-neutral-900">
                {label}
              </p>
            )}
            {description && (
              <p className="text-sm text-neutral-500 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
