'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlans, createPlan, updatePlan, deletePlan } from '@/lib/actions/plans';

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({ id: '', name: '', price: '', interval: 'monthly' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const data = await getPlans();
    setPlans(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editingPlan) {
        result = await updatePlan(editingPlan.id, { ...formData, price: Number(formData.price) });
      } else {
        result = await createPlan({ ...formData, price: Number(formData.price) });
      }

      if (result.success) {
        toast.success(editingPlan ? 'Plano atualizado!' : 'Plano criado com sucesso!');
        setIsModalOpen(false);
        setEditingPlan(null);
        setFormData({ id: '', name: '', price: '', interval: 'monthly' });
        fetchPlans();
      } else {
        toast.error(result.error);
      }
    } catch (err: any) {
      toast.error('Erro de conexão com o servidor');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este plano?')) {
      const result = await deletePlan(id);
      if (result.success) {
        toast.success('Plano removido');
        fetchPlans();
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1F36]">Planos</h1>
          <p className="text-gray-500 mt-1">Gerencie os pacotes e preços do seu SaaS.</p>
        </div>
        <Button onClick={() => { setEditingPlan(null); setIsModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Plano
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Intervalo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-mono text-xs">{plan.id}</TableCell>
                <TableCell className="font-semibold">{plan.name}</TableCell>
                <TableCell>
                  <Badge variant="default">{plan.interval}</Badge>
                </TableCell>
                <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(plan.price))}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingPlan(plan); setFormData({ ...plan, price: plan.price.toString() }); setIsModalOpen(true); }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL CRUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1A1F36]/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-xl font-bold mb-6">{editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingPlan && (
                  <Input label="ID do Plano (ex: mensal)" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required />
                )}
                <Input label="Nome do Plano" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <Input label="Preço (BRL)" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                
                <div>
                  <label className="text-sm font-medium text-[#4F5B76] px-1 mb-1 block">Intervalo</label>
                  <select 
                    className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF]"
                    value={formData.interval}
                    onChange={e => setFormData({...formData, interval: e.target.value})}
                  >
                    <option value="fortnightly">Quinzenal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                    <option value="lifetime">Vitalício</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                  <Button type="submit" className="flex-1">Salvar Plano</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
