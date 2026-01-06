import { cn } from "./ui/utils";

export type StatusType = "pending" | "in-progress" | "completed" | "overdue" | "active" | "locked";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "En progreso",
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  completed: {
    label: "Completado",
    className: "bg-success/10 text-success-foreground border-success/20",
  },
  overdue: {
    label: "Vencido",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  active: {
    label: "Activo",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  locked: {
    label: "Bloqueado",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {label || config.label}
    </span>
  );
}
