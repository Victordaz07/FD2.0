/**
 * Toast - Notificación toast
 */

import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../ui/utils";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isVisible: boolean;
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-blue-500 text-white',
};

export function Toast({ isVisible, type, message, onClose, duration = 3000 }: ToastProps) {
  const Icon = icons[type];
  
  // Auto-close
  if (isVisible && duration > 0) {
    setTimeout(onClose, duration);
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-[390px] mx-auto"
        >
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-2xl shadow-lg",
            styles[type]
          )}>
            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
            
            <p className="flex-1 text-sm font-medium">
              {message}
            </p>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
