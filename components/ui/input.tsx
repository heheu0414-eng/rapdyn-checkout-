'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-[#4F5B76] px-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#1A1F36] shadow-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-100 focus:border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1 px-1"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
