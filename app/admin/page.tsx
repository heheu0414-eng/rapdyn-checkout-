import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Users, 
  MousePointer2 
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesChart, FunnelChart } from '@/components/dashboard/charts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getDashboardStats } from '@/lib/actions/dashboard';
import { getProfile } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const profile = await getProfile();
  
  if (!profile) {
    redirect('/login');
  }

  const stats = await getDashboardStats();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1F36]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bem-vindo à visão geral do seu SaaS.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Receita Total" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={DollarSign}
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="MRR" 
          value={formatCurrency(stats.mrr)} 
          icon={TrendingUp}
          trend={{ value: 8, isUp: true }}
        />
        <StatCard 
          title="Assinaturas Ativas" 
          value={stats.activeSubsCount.toString()} 
          icon={Zap}
        />
        <StatCard 
          title="Ticket Médio" 
          value={formatCurrency(stats.avgTicket)} 
          icon={Users}
        />
        <StatCard 
          title="Taxa de Conversão" 
          value={`${stats.conversionRate.toFixed(2)}%`} 
          icon={MousePointer2}
          trend={{ value: 5, isUp: false }}
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Volume de Vendas (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={stats.salesByDay} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Funil de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart data={stats.funnel} />
          </CardContent>
        </Card>
      </div>

      {/* RECENT SALES PLACEHOLDER */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Transações Recentes</CardTitle>
          <button className="text-sm font-medium text-[#635BFF] hover:underline">Ver tudo</button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm italic">Implementaremos a tabela avançada na próxima etapa.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
