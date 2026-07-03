import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'premium' | 'verified' | 'success' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    premium: 'bg-surface-secondary/80 border-gold-metallic text-gold-metallic',
    verified: 'bg-success/10 border-success/20 text-success',
    success: 'bg-success/10 border-success/20 text-success',
    default: 'bg-surface-secondary border-stroke text-text-sec',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
