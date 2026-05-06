'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('config');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-8 text-pink-500">Rapdyn ADM</h1>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'config' ? 'bg-pink-600' : 'hover:bg-gray-800'}`}
          >
            ⚙️ Configurações API
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'plans' ? 'bg-pink-600' : 'hover:bg-gray-800'}`}
          >
            💎 Planos & Preços
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'sales' ? 'bg-pink-600' : 'hover:bg-gray-800'}`}
          >
            💰 Vendas
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'logs' ? 'bg-pink-600' : 'hover:bg-gray-800'}`}
          >
            📋 Logs do Sistema
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === 'config' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6">Credenciais Rapdyn</h2>
            <form className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client ID</label>
                <input type="text" className="mt-1 w-full p-3 border rounded-lg bg-gray-50" placeholder="Cole seu Client ID aqui..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                <input type="password" className="mt-1 w-full p-3 border rounded-lg bg-gray-50" placeholder="Cole seu Client Secret aqui..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Token / API Key (Opcional)</label>
                <input type="password" className="mt-1 w-full p-3 border rounded-lg bg-gray-50" placeholder="Se necessário para autenticação..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Webhook Secret Token</label>
                <input type="text" className="mt-1 w-full p-3 border rounded-lg bg-gray-50 border-pink-300" placeholder="Token para validar os webhooks recebidos..." />
                <p className="text-xs text-gray-500 mt-1">Configure na Rapdyn para enviar este token na query (?token=) ou no Header.</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Salvar Credenciais</button>
            </form>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6">Gerenciar Planos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Quinzenal', 'Mensal', 'Vitalício'].map(plan => (
                <div key={plan} className="border p-4 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">{plan}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500">Preço Atual (R$)</label>
                      <input type="number" step="0.01" className="w-full p-2 border rounded mt-1" defaultValue={plan === 'Mensal' ? 59.99 : 34.99} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Link de Checkout</label>
                      <input type="text" readOnly className="w-full p-2 border rounded mt-1 bg-gray-100 text-sm" value={`/checkout?plano=${plan.toLowerCase()}`} />
                    </div>
                    <button className="w-full bg-gray-900 text-white py-2 rounded font-bold hover:bg-gray-800">Atualizar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6">Histórico de Vendas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="p-3">Data</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Plano</th>
                    <th className="p-3">Método</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">Hoje, 14:30</td>
                    <td className="p-3 font-medium">João Silva<br/><span className="text-xs font-normal text-gray-400">joao@email.com</span></td>
                    <td className="p-3">Mensal</td>
                    <td className="p-3">PIX</td>
                    <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">PAID</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-6">Logs de Integração (Rapdyn)</h2>
            <div className="space-y-4">
              <div className="border p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">ERROR</span>
                  <span className="text-xs text-gray-500">Há 10 minutos</span>
                </div>
                <h3 className="font-bold text-sm mb-2">Resposta da Rapdyn API: Status 400</h3>
                <p className="text-xs text-gray-600 mb-2">Exemplo de log salvo pelo sistema caso o payload enviado seja rejeitado pela Rapdyn.</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                  {`{\n  "error": "invalid_payload",\n  "message": "The field 'document' is required for PIX payments"\n}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
