import { ReactNode } from "react";
import { cn } from "./ui/utils";

interface ColorfulCardProps {
  children: ReactNode;
  variant?: "purple" | "green" | "blue" | "pink" | "orange" | "yellow" | "red" | "teal";
  className?: string;
}

const variantStyles = {
  purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30",
  green: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30",
  pink: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30",
  orange: "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30",
  yellow: "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30",
  red: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30",
  teal: "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30",
};

export function ColorfulCard({ children, variant = "purple", className }: ColorfulCardProps) {
  return (
    <div className={cn("rounded-2xl p-5", variantStyles[variant], className)}>
      {children}
    </div>
  );
}
