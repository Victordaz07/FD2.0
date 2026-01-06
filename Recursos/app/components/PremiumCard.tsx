import { ReactNode } from "react";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

interface PremiumCardProps {
  children: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-white border border-border shadow-sm hover:shadow-md",
  primary: "bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200",
  success: "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200",
  warning: "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-200",
  info: "bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-200",
};

export function PremiumCard({ children, variant = "default", className, onClick }: PremiumCardProps) {
  return (
    <Card
      className={cn(
        "p-4 rounded-xl transition-all duration-200",
        variantStyles[variant],
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}
