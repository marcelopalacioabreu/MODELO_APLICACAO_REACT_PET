'use client';

import React, { useState, useEffect } from 'react';
import { getLostPets } from '@/services/apiService';
import { BellRing, MapPin, Phone, AlertTriangle, ShieldCheck, CheckCircle2, Search, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const AlertsAdminPage = () => {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getLostPets();
        setLostPets(res.data || []);
      } catch (err) {
        toast.error("Falha ao sincronizar alertas");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="animate-pulse p-8 text-center text-slate-400 font-black uppercase tracking-[0.3em]">Escaneando Ocorrências...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Central de Alertas</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoramento de animais desaparecidos em Juiz de Fora.</p>
        </div>
        <button className="px-8 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center gap-3">
          <Plus size={18} /> Novo Registro de Sumiço
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lostPets.map((pet) => (
          <div key={pet._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8 hover:shadow-xl transition-all">
            <div className="w-24 h-24 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
               <AlertTriangle size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h3 className="text-lg font-black uppercase text-slate-800">{pet.name}</h3>
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[8px] font-black uppercase tracking-widest rounded-full">Desaparecido</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tight mb-4">{pet.breed} • {pet.species}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <MapPin size={14} className="text-rose-500" /> Juiz de Fora
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Phone size={14} className="text-emerald-600" /> {pet.tutor?.phone || 'Não informado'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                Marcar como Encontrado
              </button>
              <button className="px-6 py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                Gerenciar
              </button>
            </div>
          </div>
        ))}
      </div>

      {lostPets.length === 0 && (
        <div className="py-20 bg-emerald-50/30 rounded-[3rem] border-2 border-dashed border-emerald-100 text-center">
          <CheckCircle2 size={48} className="mx-auto text-emerald-200 mb-4" />
          <h3 className="text-lg font-black text-emerald-400 uppercase">Tudo Sob Controle</h3>
          <p className="text-xs text-emerald-400 font-medium">Nenhum animal desaparecido reportado nas últimas 24h.</p>
        </div>
      )}
    </div>
  );
};

export default AlertsAdminPage;
