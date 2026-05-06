'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Settings, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  BarChart3
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Vendas', href: '/admin/sales', icon: CreditCard },
  { name: 'Planos', href: '/admin/plans', icon: Zap },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Logs', href: '/admin/logs', icon: FileText },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="relative flex flex-col h-screen bg-white border-r border-gray-100 z-50 transition-all duration-300 ease-in-out hidden md:flex"
    >
      {/* LOGO */}
      <div className="h-20 flex items-center px-6 gap-3">
        <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-xl text-[#1A1F36] whitespace-nowrap"
            >
              Rapdyn SaaS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 space-y-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group cursor-pointer relative',
                isActive ? 'bg-[#635BFF]/5 text-[#635BFF]' : 'text-[#4F5B76] hover:bg-gray-50'
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-[#635BFF] rounded-r-full"
                  />
                )}
                <item.icon className={cn('w-5 h-5', isActive ? 'text-[#635BFF]' : 'text-[#4F5B76] group-hover:text-[#1A1F36]')} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* TOGGLE */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 flex items-center justify-center border-t border-gray-100 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5 text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-400" />}
      </button>
    </motion.aside>
  );
}
