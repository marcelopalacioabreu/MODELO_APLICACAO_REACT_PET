'use client';

import React, { useState, useEffect } from 'react';
import { getLocations, updateLocationStatus } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { Building, MapPin, ShieldCheck, Heart, Users, Activity, Plus, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const UnitsAdminPage = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.roleName === 'ADMIN';

  const fetchData = async () => {
    try {
      const res = await getLocations();
      setUnits(res.data || []);
    } catch (err) {
      toast.error("Falha ao listar rede parceira");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await updateLocationStatus(id, status);
      if (res.success) {
        toast.success(`Unidade ${status === 'APPROVED' ? 'Aprovada' : 'Rejeitada'} com sucesso!`);
        fetchData();
      }
    } catch (err) {
      toast.error("Erro ao atualizar status da unidade");
    }
  };

  if (loading) return <div className="animate-pulse p-8 text-center text-slate-400 font-black uppercase tracking-[0.3em]">Carregando Matriz Operacional...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Rede de Unidades</h1>
          <p className="text-slate-500 text-sm font-medium">Gestão de Clínicas, ONGs e Unidades Municipais.</p>
        </div>
        {isAdmin && (
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3">
            <Plus size={18} /> Cadastrar Nova Unidade
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {units.map((unit) => (
          <div key={unit._id} className={`bg-white p-8 rounded-[3rem] border-2 transition-all group overflow-hidden relative ${unit.status === 'PENDING' ? 'border-amber-100 shadow-amber-50' : 'border-slate-100 shadow-sm'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
            
            <div className="flex items-start justify-between mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform ${unit.status === 'APPROVED' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <Building size={32} />
              </div>
              <div className="text-right">
                {unit.status === 'PENDING' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <Clock size={10} /> Aguardando Moderação
                  </span>
                )}
                {unit.status === 'APPROVED' && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Unidade Aprovada
                  </span>
                )}
                {unit.status === 'REJECTED' && (
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                    <XCircle size={10} /> Credenciamento Negado
                  </span>
                )}
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{unit.type || 'HOSPITAL'}</p>
              </div>
            </div>

            <h3 className="text-xl font-black uppercase text-slate-900 mb-2">{unit.name}</h3>
            <div className="flex items-start gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
              <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" /> 
              <span>
                {typeof unit.address === 'object' 
                  ? `${unit.address.street || ''}, ${unit.address.number || 'S/N'} - ${unit.address.neighborhood || ''}, ${unit.address.city || 'Juiz de Fora'}`
                  : unit.address || 'Endereço não informado'}
              </span>
            </div>

            {isAdmin && unit.status === 'PENDING' ? (
              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => handleStatusUpdate(unit._id, 'APPROVED')}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Aprovar Unidade
                </button>
                <button 
                  onClick={() => handleStatusUpdate(unit._id, 'REJECTED')}
                  className="px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                >
                  Rejeitar
                </button>
              </div>
            ) : (
              <button 
                disabled={unit.status !== 'APPROVED'}
                className={`w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  unit.status === 'APPROVED' 
                  ? 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {unit.status === 'APPROVED' ? 'Acessar Painel da Unidade' : 'Acesso Bloqueado'}
              </button>
            )}
          </div>
        ))}
      </div>

      {units.length === 0 && (
        <div className="py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
          <Building size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-black text-slate-400 uppercase">Rede Vazia</h3>
          <p className="text-xs text-slate-400 font-medium">Não há unidades cadastradas no ecossistema.</p>
        </div>
      )}
    </div>
  );
};

export default UnitsAdminPage;
