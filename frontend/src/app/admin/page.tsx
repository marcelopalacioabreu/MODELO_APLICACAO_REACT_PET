'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Calendar,
  Users,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ArrowRight,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPets } from '../../services/apiService';
import Link from 'next/link';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [myPets, setMyPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isTutor = user?.role === 'TUTOR';

  useEffect(() => {
    if (isTutor) {
      getPets().then(res => {
        if (res.success) setMyPets(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isTutor]);

  const stats = [
    { label: 'Total de PETs', value: '1,284', icon: Dog, color: 'bg-blue-500', trend: '+12% este mês' },
    { label: 'Vacinas Aplicadas', value: '452', icon: ShieldCheck, color: 'bg-green-500', trend: '85% da meta' },
    { label: 'Atendimentos Hoje', value: '28', icon: Activity, color: 'bg-orange-500', trend: '4 pendentes' },
    { label: 'Alertas Críticos', value: '3', icon: AlertTriangle, color: 'bg-red-500', trend: 'Urgência média' },
  ];

  if (isTutor) {
    return (
      <div className="space-y-8 animate-fadeIn text-slate-800">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Olá, {user?.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-sm font-medium">Sua área de cuidado e bem-estar animal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Seção Meus Animais */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Dog size={18} className="text-primary-green" /> Meus Animais
                 </h2>
                 <Link href="/admin/pets" className="text-[10px] font-black text-primary-green hover:underline uppercase tracking-widest">Ver Todos</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {myPets.length > 0 ? myPets.map((pet) => (
                   <div key={pet._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-green text-2xl font-black border-2 border-slate-50 group-hover:bg-primary-green group-hover:text-white transition-colors">
                            {pet.name.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-slate-800 uppercase truncate">{pet.name}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{pet.species} • {pet.breed}</p>
                         </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Stethoscope size={14} className="text-primary-green" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Saúde em Dia</span>
                         </div>
                         <Link href={`/admin/pets/${pet._id}`} className="bg-slate-900 text-white p-2 rounded-xl hover:bg-primary-green transition-all">
                            <ArrowRight size={18} />
                         </Link>
                      </div>
                   </div>
                 )) : (
                   <div className="col-span-full py-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                      <Dog size={48} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Nenhum animal cadastrado</p>
                      <Link href="/admin/pets" className="text-xs font-black text-primary-green underline mt-2 inline-block">Cadastrar Agora</Link>
                   </div>
                 )}
              </div>

              {/* Dicas Municipais */}
              <div className="bg-blue-50 rounded-[2.5rem] p-8 flex items-center gap-6 border border-blue-100">
                 <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Heart size={40} />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-blue-900 uppercase leading-tight">Dica de Saúde Municipal</h4>
                    <p className="text-sm text-blue-700 font-medium mt-1 leading-relaxed">
                       Lembre-se de manter a vacinação antirrábica em dia. Ela é gratuita em todas as unidades municipais de Juiz de Fora.
                    </p>
                 </div>
              </div>
           </div>

           {/* Sidebar Informativa para o Tutor */}
           <div className="space-y-6">
              <div className="bg-primary-green rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-primary-green/20">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                 <Calendar size={32} className="mb-6" />
                 <h3 className="text-xl font-black uppercase tracking-tight">Agenda Aberta</h3>
                 <p className="text-white/80 text-sm font-medium mt-2 leading-relaxed">
                    A próxima campanha de castração acontece em 15 dias. Prepare o cadastro do seu PET.
                 </p>
                 <button className="w-full bg-white text-primary-green font-black py-4 rounded-2xl shadow-lg mt-8 uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                    Ver Locais
                 </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Atalhos do Cidadão</h4>
                 <div className="space-y-4">
                    <Link href="/admin/pets" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary-green hover:text-white transition-all group">
                       <span className="text-sm font-black uppercase tracking-tight">Meus Pets</span>
                       <ChevronRight size={18} className="text-slate-300 group-hover:text-white" />
                    </Link>
                    <Link href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-primary-green hover:text-white transition-all group opacity-50 cursor-not-allowed">
                       <span className="text-sm font-black uppercase tracking-tight">Denunciar Maus Tratos</span>
                       <AlertTriangle size={18} className="text-slate-300 group-hover:text-white" />
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Dashboard do Administrador (Comandante)
  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Painel de Controle Municipal</h1>
        <p className="text-slate-500 text-sm font-medium">Visão geral da saúde e gestão animal municipal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Realtime</span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-primary-green mt-2 flex items-center gap-1">
              <CheckCircle2 size={12} /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Feed de Ocorrências</h2>
            <button className="text-xs font-bold text-primary-green hover:underline uppercase tracking-widest">Ver tudo</button>
          </div>
          <div className="divide-y divide-slate-50">
            {[1,2,3].map((i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-[10px]">INFO</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 uppercase">Atualização de Sistema</p>
                    <p className="text-xs text-slate-400 font-medium tracking-tighter uppercase">Há poucos minutos</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">Monitoramento</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-green rounded-[2.5rem] shadow-xl p-8 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div>
            <Calendar size={32} className="mb-6" />
            <h2 className="text-xl font-black tracking-tight mb-2 uppercase">Próxima Campanha</h2>
            <p className="text-white/20 text-sm font-medium bg-white/20 inline-block px-3 py-1 rounded-full mb-4">22 de Maio, 2026</p>
            <p className="text-sm leading-relaxed text-white/80 font-medium">Mutirão de Vacinação e Microchipagem no Parque Halfeld. Meta: 500 animais.</p>
          </div>
          <button className="w-full bg-white text-primary-green font-black py-4 rounded-2xl shadow-lg mt-8 uppercase text-xs tracking-widest hover:bg-slate-50 transition-colors active:scale-95">Gerenciar Agenda</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
