'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Menu, X, User, Heart, Info, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Causa Animal', href: '#causa', icon: Heart },
    { label: 'Unidades', href: '#unidades', icon: Info },
    { label: 'Transparência', href: '#transparencia', icon: ShieldCheck },
    { label: 'Campanhas', href: '#campanhas', icon: Megaphone },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-emerald-600 rounded-xl group-hover:rotate-12 transition-transform">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className={`text-xl font-black tracking-tighter uppercase ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
            Saúde <span className="text-emerald-600">Animal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2"
            >
              <link.icon size={14} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <Link 
              href="/admin"
              className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
            >
              <User size={16} />
              Meu Painel
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-emerald-600 transition-colors">
                Entrar
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
              >
                Cadastrar-se
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 flex items-center gap-3"
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              <hr />
              <div className="flex flex-col gap-4">
                <Link href="/login" className="text-sm font-bold text-slate-900">Entrar</Link>
                <Link href="/register" className="w-full py-3 bg-emerald-600 text-white text-center rounded-xl font-bold">Começar Agora</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNavbar;
