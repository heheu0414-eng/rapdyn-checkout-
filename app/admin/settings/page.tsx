'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    apiToken: '',
    webhookSecret: '',
    apiUrl: 'https://api.rapdyn.io'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de salvamento (Pode ser integrado a uma Server Action)
    setTimeout(() => {
      toast.success('Configurações salvas com sucesso!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1F36]">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as chaves de API e preferências do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#635BFF]" />
                <CardTitle className="text-base font-semibold">Integração Rapdyn</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <Input 
                  label="API Token (Bearer)" 
                  type="password" 
                  value={config.apiToken} 
                  onChange={e => setConfig({...config, apiToken: e.target.value})}
                  placeholder="Seu token de API da Rapdyn"
                />
                <Input 
                  label="Webhook Secret" 
                  type="text" 
                  value={config.webhookSecret} 
                  onChange={e => setConfig({...config, webhookSecret: e.target.value})}
                  placeholder="Chave para validar notificações"
                />
                <Input 
                  label="API URL" 
                  value={config.apiUrl} 
                  onChange={e => setConfig({...config, apiUrl: e.target.value})}
                />
                
                <div className="pt-4">
                  <Button type="submit" isLoading={loading} className="gap-2">
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#635BFF]" />
                <CardTitle className="text-base font-semibold">Preferências da Plataforma</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1F36]">Modo de Manutenção</p>
                    <p className="text-xs text-gray-500">Bloqueia o acesso de usuários temporariamente</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-[#635BFF]/5 border border-[#635BFF]/10">
            <CardContent className="p-6">
              <h4 className="font-bold text-[#1A1F36] mb-2">Dica de Segurança</h4>
              <p className="text-sm text-[#4F5B76] leading-relaxed">
                Nunca compartilhe seu **API Token** ou **Webhook Secret**. Essas chaves dão acesso total às suas movimentações financeiras.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
