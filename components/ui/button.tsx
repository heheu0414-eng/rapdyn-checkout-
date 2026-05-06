'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'default' | 'ghost' | 'outline' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-[#635BFF] text-white hover:bg-[#5851EB] shadow-sm',
      ghost: 'bg-transparent text-[#4F5B76] hover:bg-gray-100',
      outline: 'bg-transparent border border-gray-200 text-[#4F5B76] hover:bg-gray-50',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
      secondary: 'bg-white text-[#1A1F36] border border-gray-200 hover:bg-gray-50 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
