import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export function BottomSheet({ children, className, isOpen = true }: BottomSheetProps) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-stroke rounded-t-3xl p-6 shadow-2xl",
        className
      )}
    >
      <div className="w-12 h-1.5 bg-stroke rounded-full mx-auto mb-6" />
      {children}
    </motion.div>
  );
}
