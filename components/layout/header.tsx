'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Header() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado');
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* SEARCH / BREADCRUMBS */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar transações, clientes..."
            className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#635BFF]/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-[#1A1F36] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 group-hover:border-[#635BFF] transition-all">
            <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-[#635BFF]" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-[#1A1F36] leading-none">Admin User</p>
            <p className="text-xs text-gray-400 mt-1">Plano Enterprise</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
