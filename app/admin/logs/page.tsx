'use client';

import { useState, useEffect } from 'react';
import { FileText, Terminal, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  // Simulação de logs (Em produção buscaria via db.log.findMany)
  useEffect(() => {
    setLogs([
      { id: '1', level: 'INFO', message: 'Webhook Recebido', createdAt: new Date(), status: 200, payload: { id: 'evt_123', status: 'paid' } },
      { id: '2', level: 'ERROR', message: 'Falha na Autenticação Rapdyn', createdAt: new Date(), status: 401, payload: { error: 'Invalid API Key' } },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1F36]">Logs do Sistema</h1>
        <p className="text-gray-500 mt-1">Monitore eventos e erros de integração em tempo real.</p>
      </div>

      <Card className="border-none shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant={log.level === 'ERROR' ? 'error' : 'success'}>
                    {log.status} {log.level}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-[#1A1F36]">{log.message}</TableCell>
                <TableCell className="text-gray-500 text-xs max-w-xs truncate">
                  {log.level === 'ERROR' ? 'Verifique as credenciais da API Rapdyn' : 'Operação concluída com sucesso'}
                </TableCell>
                <TableCell className="text-gray-400 text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-xs font-mono text-[#635BFF] bg-[#635BFF]/5 px-2 py-1 rounded hover:bg-[#635BFF]/10 transition-colors">
                    view_json
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="p-6 bg-[#1A1F36] rounded-xl text-green-400 font-mono text-sm overflow-hidden border border-gray-800 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-gray-500 border-b border-gray-800 pb-2">
          <Terminal className="w-4 h-4" />
          <span>Real-time Debugger</span>
        </div>
        <pre className="overflow-auto max-h-[300px]">
          {`{
  "event": "payment.success",
  "data": {
    "id": "tx_998877",
    "customer": {
      "email": "cliente@email.com",
      "document": "***.***.***-**"
    },
    "amount": 29900,
    "status": "APPROVED"
  },
  "timestamp": "2024-05-06T00:10:00Z"
}`}
        </pre>
      </div>
    </div>
  );
}
