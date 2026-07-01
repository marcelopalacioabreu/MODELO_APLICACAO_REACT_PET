'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart3, TrendingUp, Users2, Dog, Syringe, Building2, Loader2 } from 'lucide-react';
import { parseEliteText } from '@/utils/textParser';
import { getPublicStats } from '@/services/apiService';

interface TransparencyStatsProps {
  title?: string;
  subtitle?: string;
}

const TransparencyStats = ({ title, subtitle }: TransparencyStatsProps) => {
  const [stats, setStats] = useState({
    petsProtected: 0,
    activeTutors: 0,
    vaccinesApplied: 0,
    partnerUnits: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await getPublicStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Erro ao sincronizar Portal da Transparência.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statItems = [
    { 
      label: 'Pets Protegidos', 
      value: stats.petsProtected.toLocaleString('pt-BR'), 
      icon: <Dog size={24} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Tutores Ativos', 
      value: stats.activeTutors.toLocaleString('pt-BR'), 
      icon: <Users2 size={24} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Vacinas Aplicadas', 
      value: stats.vaccinesApplied.toLocaleString('pt-BR'), 
      icon: <Syringe size={24} />,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      label: 'Unidades Parceiras', 
      value: stats.partnerUnits.toLocaleString('pt-BR'), 
      icon: <Building2 size={24} />,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 skew-x-12 translate-x-32 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Text Side */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={14} /> Portal da Transparência
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
              {parseEliteText(title || "Impacto Real: {{color:emerald-600}}Dados Abertos{{/color}}")}
            </h2>
            
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
              {subtitle || "Nossa rede municipal opera sob o Protocolo de Integridade Soberana, garantindo que cada dado seja verificado e atualizado em tempo real."}
            </p>

            <div className="flex items-center gap-6 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                       <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                     +10k
                  </div>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cidadãos Conectados</p>
            </div>

            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center gap-3 group">
               Ver Relatórios Completos
               <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
             {loading ? (
               <div className="col-span-2 py-20 flex flex-center justify-center">
                  <Loader2 className="animate-spin text-emerald-500" size={48} />
               </div>
             ) : (
               statItems.map((item, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   viewport={{ once: true }}
                   className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all group relative overflow-hidden"
                 >
                   <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{item.value}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                   
                   {/* Decorative Bar */}
                   <div className="absolute bottom-0 left-0 h-1.5 bg-emerald-500 transition-all duration-500 w-0 group-hover:w-full"></div>
                 </motion.div>
               ))
             )}
          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-20 p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Certificação de Integridade</p>
                 <p className="text-xs font-bold text-slate-400">Todos os dados passam pelo IntegrityService em cada boot.</p>
              </div>
           </div>
           <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">
              Sistema 100% Sincronizado
           </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencyStats;
