'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden border-none shadow-sm bg-white', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#635BFF]" />
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full',
              trend.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            )}>
              {trend.isUp ? '+' : '-'}{trend.value}%
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-[#4F5B76]">{title}</p>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-bold text-[#1A1F36] mt-1"
          >
            {value}
          </motion.h3>
        </div>
      </CardContent>
    </Card>
  );
}
