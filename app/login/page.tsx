'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Login realizado com sucesso!');
      
      // Redirecionamento baseado no email de admin para teste
      const isAdmin = data.user?.email === 'admin@teste.com';
      router.push(isAdmin ? '/admin' : '/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white p-8 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1F36]">Entrar na plataforma</h1>
          <p className="text-gray-500 mt-2">Bem-vindo de volta!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4F5B76] mb-1">E-mail</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#635BFF] focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4F5B76] mb-1">Senha</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#635BFF] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#635BFF] hover:bg-[#5851EB] text-white font-semibold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Não tem uma conta? </span>
          <button className="text-[#635BFF] font-medium hover:underline">Cadastre-se</button>
        </div>
      </motion.div>
      
      <p className="mt-8 text-xs text-gray-400">© 2024 Rapdyn SaaS. Todos os direitos reservados.</p>
    </div>
  );
}
