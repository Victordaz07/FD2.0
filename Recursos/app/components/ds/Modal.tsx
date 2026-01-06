/**
 * Modal Component
 * Mobile-first modal/dialog with animations
 * React Native compatible structure (similar to Modal from RN)
 */

import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../ui/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-full mx-4",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  size = "md",
  className,
}: ModalProps) {
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

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "w-full bg-white rounded-2xl shadow-xl pointer-events-auto",
                "max-h-[90vh] overflow-hidden flex flex-col",
                modalSizes[size],
                className
              )}
            >
              {/* Header */}
              {(title || description || showCloseButton) && (
                <div className="px-6 py-5 border-b border-neutral-200 flex-shrink-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {title && (
                        <h2 className="text-lg font-semibold text-neutral-900">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p className="text-sm text-neutral-500 mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-600 flex-shrink-0"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
