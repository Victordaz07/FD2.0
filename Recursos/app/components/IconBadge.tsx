import { LucideIcon } from "lucide-react";
import { cn } from "./ui/utils";

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "info" | "neutral" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  primary: "bg-indigo-100 text-indigo-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-slate-100 text-slate-700",
  danger: "bg-rose-100 text-rose-700",
};

const sizeStyles = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

export function IconBadge({ icon: Icon, variant = "primary", size = "md", className }: IconBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon className="w-1/2 h-1/2" strokeWidth={2.5} />
    </div>
  );
}
