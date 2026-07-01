'use client';

import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, QrCode, BellRing, Trophy, Heart } from 'lucide-react';
import { parseEliteText } from '@/utils/textParser';
import Link from 'next/link';

interface EngagementCardsProps {
  title?: string;
  subtitle?: string;
}

const EngagementCards = ({ title, subtitle }: EngagementCardsProps) => {
  const tutorBenefits = [
    { title: 'Identificação Digital', desc: 'Gere um QR Code exclusivo para seu PET.', icon: QrCode },
    { title: 'Histórico de Saúde', desc: 'Todas as vacinas e exames em um só lugar.', icon: ShieldCheck },
    { title: 'Alerta de Sumiço', desc: 'Notifique a rede em segundos se o pet sumir.', icon: BellRing },
    { title: 'Ganhe XP', desc: 'Quanto mais engajado, mais famoso seu PET fica.', icon: Trophy },
  ];

  return (
    <section id="causa" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Engajamento Comunitário</h3>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-8">
              {parseEliteText(title || "Por que fazer parte da nossa Rede de Elite?")}
            </h2>
            <p className="text-slate-500 font-medium mb-12 leading-relaxed">
              {parseEliteText(subtitle || "A Aplicação Modelo não é apenas um cadastro. É um ponto de partida para sua plataforma.")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {tutorBenefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <benefit.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{benefit.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-snug">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-600/20">
              <UserPlus size={18} />
              Quero cadastrar meu PET
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div whileHover={{ scale: 1.02 }} className="p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden group">
              <Heart className="text-blue-400 mb-6" size={40} fill="currentColor" />
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-blue-400">Clínicas, ONGs & Voluntários</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Integre sua unidade ao sistema municipal. Gerencie vacinações, internações e campanhas com tecnologia de ponta e visibilidade para toda a cidade.
              </p>
              <Link href="/unidades/cadastro" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white hover:text-blue-400 transition-colors">
                Solicitar Credenciamento <ShieldCheck size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-xl relative overflow-hidden group">
              <BellRing className="text-emerald-600 mb-6" size={40} />
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-emerald-600">Alerta Comunitário</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Quando um pet desaparece, nossa rede é acionada instantaneamente. A comunidade e as clínicas recebem o alerta em tempo real.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                Rede ativa em Juiz de Fora
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementCards;
