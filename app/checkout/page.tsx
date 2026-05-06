'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plano'); // ex: 'mensal'

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    method: 'PIX'
  });

  const [qrCode, setQrCode] = useState('');
  const [qrCodeCopyPaste, setQrCodeCopyPaste] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const idempotencyKey = crypto.randomUUID();

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'idempotency-key': idempotencyKey
        },
        body: JSON.stringify({ ...formData, planId }),
      });

      // Proteção contra JSON inválido
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Falha na resposta do servidor (JSON inválido)');
      }

      if (!response.ok || data.success === false) {
        const errorMsg = data.error || 'Erro no processamento';
        throw new Error(errorMsg);
      }

      const tx = data.data;

      if (tx && tx.qrCode) {
        setQrCode(tx.qrCode);
        setQrCodeCopyPaste(tx.qrCodeCopyPaste);
      } else {
        window.location.href = '/checkout/sucesso';
      }

    } catch (err: any) {
      setError(err.message || 'Falha na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F9FC] p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Aguardando Pagamento</h2>
          <p className="text-gray-500 mb-8 text-sm">Escaneie o QR Code abaixo com seu app do banco. O acesso é liberado instantaneamente.</p>
          
          <div className="relative p-2 bg-white border-2 border-dashed border-gray-200 rounded-xl mb-6">
            <img src={qrCode} alt="QR Code PIX" className="mx-auto w-64 h-64" />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl break-all text-[11px] font-mono text-gray-400 mb-6 border border-gray-100 select-all">
            {qrCodeCopyPaste}
          </div>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText(qrCodeCopyPaste);
              alert('Código copiado!');
            }}
            className="w-full bg-[#635BFF] hover:bg-[#0A2540] text-white font-semibold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            Copiar Código PIX
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FC] p-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl w-full border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#0A2540] mb-2">Finalizar Compra</h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
            {planId || 'Selecionar Plano'}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 text-sm flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nome Completo</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Como no cartão" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">CPF</label>
                <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">WhatsApp</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Método de Pagamento</label>
            <div className="grid grid-cols-1 gap-3">
              <label className={`group relative p-5 rounded-2xl cursor-pointer flex items-center gap-4 transition-all border-2 ${formData.method === 'PIX' ? 'border-[#635BFF] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="method" value="PIX" checked={formData.method === 'PIX'} onChange={handleChange} className="w-5 h-5 text-[#635BFF] border-gray-300 focus:ring-[#635BFF]" />
                <div className="flex-1">
                  <p className="font-bold text-[#0A2540]">PIX</p>
                  <p className="text-xs text-gray-500">Liberação imediata</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 font-bold text-xs">PIX</span>
                </div>
              </label>
              
              <label className="p-5 rounded-2xl cursor-not-allowed flex items-center gap-4 border-2 border-gray-50 opacity-40 bg-gray-50">
                <input disabled type="radio" name="method" value="CREDIT_CARD" />
                <div className="flex-1">
                  <p className="font-bold text-gray-400">Cartão de Crédito</p>
                  <p className="text-xs text-gray-400 italic">Em breve</p>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#635BFF] hover:bg-[#0A2540] text-white font-bold py-5 rounded-2xl mt-4 transition-all shadow-xl disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : 'Confirmar e Pagar'}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Pagamento Processado via Stripe Secured
          </p>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
