'use client';

import { ShieldCheck, Mail, Phone, MapPin, Heart, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const LandingFooter = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600"></div>
      
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600/20 rounded-xl">
              <ShieldCheck size={24} className="text-emerald-500" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">
              Saúde <span className="text-emerald-500">Animal</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Plataforma oficial de gestão animal de Juiz de Fora. Tecnologia a serviço da vida e da proteção dos nossos melhores amigos.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-emerald-500 transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors"><Facebook size={20} /></Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors"><Twitter size={20} /></Link>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Plataforma</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Início</Link></li>
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Transparência</Link></li>
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Pets Perdidos</Link></li>
            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Campanhas</Link></li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Contato</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail size={16} /> suporte@saudeanimal.jf</li>
            <li className="flex items-center gap-3"><Phone size={16} /> (32) 3690-0000</li>
            <li className="flex items-center gap-3"><MapPin size={16} /> Juiz de Fora, MG</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Fique por dentro</h4>
          <p className="text-xs mb-4">Receba atualizações sobre campanhas de vacinação e eventos.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-emerald-500 transition-all" 
            />
            <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
              <Heart size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase font-black tracking-widest">
          © 2026 Empresa Municipal de Tecnologias - Juiz de Fora
        </p>
        <div className="flex gap-8 text-[10px] uppercase font-black tracking-widest">
          <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          <Link href="#" className="hover:text-white transition-colors">Termos</Link>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
