/**
 * SheetFormLayout - Layout para sheets de formularios
 */

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { cn } from "../ui/utils";

interface SheetFormLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function SheetFormLayout({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: SheetFormLayoutProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50",
              "bg-white rounded-t-3xl shadow-xl",
              "max-h-[90vh] flex flex-col",
              className
            )}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-neutral-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {description}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={onClose}
                  className="ml-4 w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-4">
                {children}
              </div>
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex-shrink-0 p-5 border-t border-neutral-200 bg-neutral-50">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
