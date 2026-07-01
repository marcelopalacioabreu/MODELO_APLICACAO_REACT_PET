'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light p-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-red-100">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Acesso Negado</h1>
        <p className="text-slate-500 mb-8 font-medium">
          Você não possui permissão para acessar esta área. Entre em contato com o administrador se acredita que isso é um erro.
        </p>
        <Link 
          href="/admin" 
          className="inline-block w-full bg-primary-green hover:bg-primary-teal text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
