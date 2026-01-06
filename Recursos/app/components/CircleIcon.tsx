import { LucideIcon } from "lucide-react";
import { cn } from "./ui/utils";

interface CircleIconProps {
  icon: LucideIcon;
  variant?: "purple" | "green" | "blue" | "pink" | "orange" | "yellow" | "red" | "teal" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const variantStyles = {
  purple: "bg-purple-500 text-white",
  green: "bg-emerald-500 text-white",
  blue: "bg-blue-500 text-white",
  pink: "bg-pink-500 text-white",
  orange: "bg-orange-500 text-white",
  yellow: "bg-amber-400 text-white",
  red: "bg-red-500 text-white",
  teal: "bg-teal-500 text-white",
  white: "bg-white text-purple-600",
};

const sizeStyles = {
  sm: "w-8 h-8 p-1.5",
  md: "w-10 h-10 p-2",
  lg: "w-12 h-12 p-2.5",
  xl: "w-16 h-16 p-4",
};

const iconSizeStyles = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-7 h-7",
  xl: "w-8 h-8",
};

export function CircleIcon({ 
  icon: Icon, 
  variant = "purple", 
  size = "md",
  className 
}: CircleIconProps) {
  return (
    <div className={cn(
      "rounded-full flex items-center justify-center flex-shrink-0",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      <Icon className={iconSizeStyles[size]} />
    </div>
  );
}
