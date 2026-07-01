'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser } from '@/services/apiService';
import { toast } from 'react-toastify';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Loader2, 
  Eye, 
  EyeOff, 
  User, 
  ChevronRight, 
  AlertCircle,
  Activity,
  Heart,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ParticlesBackground from '@/components/home/ParticlesBackground';
import { sanitizeCPF } from '@/utils/cpfUtils';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [sessionMessage, setSessionMessage] = useState('');
  const [error, setError] = useState('');

  // Captcha State
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [correctCaptchaAnswer, setCorrectCaptchaAnswer] = useState(0);

  useEffect(() => {
    document.title = "Acesso Seguro - Aplicação Modelo";
    generateCaptcha();
    
    const reason = searchParams.get('reason');
    if (reason === 'session_expired' || reason === 'session_invalidated') {
      setSessionMessage('Sua sessão expirou ou foi acessada em outro dispositivo. Por favor, entre novamente por segurança.');
    }
  }, [searchParams]);

  // Elite Redirection Guard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (user?.mustChangePassword) {
        router.push('/auth/change-password');
      } else {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, authLoading, user, router]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCorrectCaptchaAnswer(num1 + num2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (parseInt(captchaAnswer, 10) !== correctCaptchaAnswer) {
      setError('Desafio de segurança incorreto.');
      generateCaptcha();
      setCaptchaAnswer('');
      return;
    }

    setLoading(true);
    try {
      const identifier = formData.identifier.trim();
      const isEmail = identifier.includes('@');
      
      const payload: any = {
        password: formData.password
      };

      if (isEmail) {
        payload.email = identifier.toLowerCase();
      } else {
        payload.cpf = sanitizeCPF(identifier);
      }

      const res = await loginUser(payload);
      if (res.success) {
        login(res.token, res.refreshToken);
        toast.success(`Bem-vindo, ${res.user.name}!`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Credenciais inválidas ou erro no servidor";
      setError(msg);
      toast.error(msg);
      generateCaptcha();
      setCaptchaAnswer('');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (isAuthenticated && !sessionMessage)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground id="login-particles" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/10 via-transparent to-blue-600/10"></div>
      </div>

      {/* Login Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        
        {/* Branding Side (Elite) */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center w-12 h-12">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase">APLICAÇÃO MODELO</h2>
            </div>
            
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-6">
              SISTEMA DE <br />
              <span className="text-emerald-200">GESTÃO ELITE</span>
            </h1>
            <p className="text-emerald-50/70 text-lg font-medium max-w-xs leading-relaxed">
              Plataforma integrada de vigilância, saúde e proteção para o ecossistema animal municipal.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" /> AMBIENTE SEGURO</span>
              <span className="flex items-center gap-2"><Activity size={14} /> EMTEC CORE</span>
            </div>
          </div>

          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Form Side */}
        <div className="p-12 lg:p-20 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden inline-block p-4 bg-emerald-600 rounded-2xl mb-6 shadow-xl shadow-emerald-600/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-3">Protocolo de Acesso</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
              Identificação <br /> Requerida
            </h2>
          </div>

          <AnimatePresence>
            {sessionMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-[2rem] text-amber-800 shadow-lg shadow-amber-900/5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-200 rounded-full">
                    <AlertCircle size={20} className="text-amber-900" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tighter">Aviso de Segurança</span>
                </div>
                <p className="text-xs font-bold leading-tight opacity-90">{sessionMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Identifier (Email/CPF) */}
              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block group-focus-within:text-emerald-600 transition-colors">Operador (E-mail ou CPF)</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="E-mail ou CPF"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-600/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block group-focus-within:text-emerald-600 transition-colors">Chave de Segurança</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-600/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold uppercase tracking-tight"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            {/* Captcha de Segurança */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-2">Verificação de Segurança (Captcha)</label>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-lg font-black text-emerald-600 tracking-widest px-2">
                  {captchaQuestion}
                </span>
                <input 
                  type="text" 
                  value={captchaAnswer} 
                  onChange={(e) => setCaptchaAnswer(e.target.value)} 
                  placeholder="?" 
                  required 
                  className="w-full p-2 text-center bg-slate-50 border-none rounded-xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20" 
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-between items-center bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 px-8 rounded-[1.5rem] transition-all duration-500 shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
            >
              <span className="text-xs uppercase tracking-[0.3em]">
                {loading ? 'Validando...' : 'Entrar no Sistema'}
              </span>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center lg:text-left">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Novo na rede?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register" className="text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-2">
                <Heart size={14} /> Quero ser Tutor
              </Link>
              <Link href="/unidades/cadastro" className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-2">
                <Cpu size={14} /> Cadastrar Clínica/ONG
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 flex gap-8 text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-50">
        <div className="flex items-center gap-2"><ShieldCheck size={14} /> PJF DIGITAL</div>
        <div className="flex items-center gap-2"><Activity size={14} /> EMTEC CORE</div>
        <div className="flex items-center gap-2"><Heart size={14} /> BEM-ESTAR ANIMAL</div>
      </div>
    </div>
  );
};

export default LoginPage;
