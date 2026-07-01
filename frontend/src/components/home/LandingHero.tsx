'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, ShieldCheck, Star } from 'lucide-react';

import { parseEliteText } from '@/utils/textParser';

interface LandingHeroProps {
  title?: string;
  subtitle?: string;
}

const LandingHero = ({ title, subtitle }: LandingHeroProps) => {
  const defaultTitle = "A vida animal merece tecnologia de elite.";
  const defaultSubtitle = "Unimos tutores, clínicas, ONGs e o poder público em uma rede inteligente de proteção, saúde e transparência.";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-50">
      {/* ... (rest of background code) ... */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Star size={14} fill="currentColor" />
            <span>Plataforma Oficial Juiz de Fora</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8 uppercase"
          >
            {parseEliteText(title || defaultTitle)}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl"
          >
            {parseEliteText(subtitle || defaultSubtitle)}
          </motion.p>

          {/* ... (rest of component code) ... */}

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/register"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
            >
              <Heart size={18} />
              <span>Sou Tutor</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/unidades/cadastro"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-emerald-600 hover:text-emerald-600 transition-all active:scale-95"
            >
              <ShieldCheck size={18} />
              <span>Clínicas & ONGs</span>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all"
          >
            <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-tighter">
              <span className="text-2xl">PJF</span>
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-tighter">
              <span className="text-2xl">EMTEC</span>
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-tighter">
              <span className="text-2xl">CANIL</span>
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-tighter">
              <span className="text-2xl">ZOONOSES</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Image / Pet Star Reveal */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
    </section>
  );
};

export default LandingHero;
