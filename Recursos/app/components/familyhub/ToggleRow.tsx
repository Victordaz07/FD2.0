/**
 * ToggleRow - Fila con toggle switch
 */

import { cn } from "../ui/utils";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className,
}: ToggleRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-3",
      disabled && "opacity-50",
      className
    )}>
      <div className="flex-1 pr-3">
        <p className="text-base font-medium text-neutral-900">{label}</p>
        {description && (
          <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      
      <label className={cn(
        "relative inline-flex cursor-pointer flex-shrink-0",
        disabled && "cursor-not-allowed"
      )}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        
        {/* Track */}
        <div className={cn(
          "w-11 h-6 rounded-full transition-colors duration-200",
          "peer-checked:bg-indigo-600 bg-neutral-200",
          "peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2",
          disabled && "peer-checked:bg-neutral-300"
        )} />
        
        {/* Thumb */}
        <div className={cn(
          "absolute top-0.5 left-0.5",
          "bg-white rounded-full shadow-sm",
          "w-5 h-5",
          "transition-transform duration-200",
          checked && "translate-x-5"
        )} />
      </label>
    </div>
  );
}
