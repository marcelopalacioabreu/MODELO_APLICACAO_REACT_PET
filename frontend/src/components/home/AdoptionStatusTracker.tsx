'use client';

import React, { useState } from 'react';
import { Search, Loader2, Clock, CheckCircle, XCircle, Dog, Building, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AdoptionStatusTracker = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.get(`/api/adoptions/track/${identifier}`);
      setResult(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Solicitação não encontrada. Verifique o CPF ou Protocolo.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle size={20} />;
      case 'REJECTED': return <XCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Solicitação Aprovada';
      case 'REJECTED': return 'Solicitação Rejeitada';
      default: return 'Em Análise Clínica';
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Acompanhe sua <span className="text-emerald-600">Adoção</span></h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-4">Transparência e Rastreabilidade Industrial</p>
          </div>

          <div className="bg-slate-50 rounded-[3rem] p-2 border border-slate-100 shadow-inner mb-12">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-2">
               <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Digite seu CPF ou número do Protocolo..."
                    className="w-full pl-16 pr-6 py-6 bg-transparent text-lg font-bold outline-none placeholder:text-slate-300"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
               </div>
               <button 
                 disabled={loading}
                 className="px-10 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : "Consultar Status"}
               </button>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 bg-rose-50 text-rose-600 rounded-3xl text-center font-bold text-sm border border-rose-100">
                 {error}
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[3rem] border-2 border-slate-50 p-8 md:p-12 shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                 
                 <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-xl ring-8 ring-slate-50 shrink-0">
                       <img src={result.petPhoto || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'} className="w-full h-full object-cover" alt="Pet" />
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                       <div>
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border mb-4 ${getStatusStyle(result.status)}`}>
                             {getStatusIcon(result.status)}
                             {getStatusText(result.status)}
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{result.petName}</h3>
                          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{result.petBreed}</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Building size={18} />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Unidade</p>
                                <p className="text-xs font-bold text-slate-700 uppercase">{result.unitName}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Calendar size={18} />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Manifestado em</p>
                                <p className="text-xs font-bold text-slate-700 uppercase">{new Date(result.createdAt).toLocaleDateString('pt-BR')}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="md:w-48 text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 shrink-0">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocolo</p>
                       <p className="text-lg font-black text-slate-900 tracking-wider">{result.protocol}</p>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AdoptionStatusTracker;
