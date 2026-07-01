'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { changePassword as changePasswordApi } from '@/services/apiService';
import { Lock, Eye, EyeOff, ShieldCheck, Cpu, ChevronRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ChangePasswordPage = () => {
  useEffect(() => {
    document.title = "Segurança da Conta - Aplicação Modelo";
  }, []);

  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi({ oldPassword, newPassword });
      
      // Elite: Atualizar o estado do usuário globalmente antes de redirecionar
      await refreshUser();
      
      setMessage('Senha atualizada com sucesso! Redirecionando...');
      toast.success('Protocolo de segurança atualizado.');
      
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao atualizar senha. Verifique os dados.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Fundo de Elite */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/10 via-transparent to-blue-600/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Container Principal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        
        {/* Branding Side */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-slate-900 to-emerald-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-emerald-500/20 rounded-2xl backdrop-blur-md flex items-center justify-center w-12 h-12">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase">APLICAÇÃO MODELO</h2>
            </div>
            
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-6">
              REFORÇO DE <br />
              <span className="text-emerald-400">SEGURANÇA</span>
            </h1>
            <p className="text-slate-300 text-lg font-medium max-w-xs leading-relaxed">
              Para garantir a integridade da plataforma e dos dados dos animais, é necessário definir uma nova credencial de acesso.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" /> AES-256 ENCRYPTED</span>
              <span className="flex items-center gap-2"><Cpu size={14} /> SECURITY NODE</span>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Form Side */}
        <div className="p-12 lg:p-20 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-3">Atualização Obrigatória</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
              Nova Chave <br /> de Acesso
            </h2>
          </div>

          <AnimatePresence>
            {user?.mustChangePassword && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-2xl flex gap-4 items-start"
              >
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Ação Requerida</p>
                  <p className="text-xs font-bold text-amber-800 leading-snug">
                    Você está utilizando uma senha provisória. Por segurança, altere-a agora para continuar.
                  </p>
                </div>
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl flex gap-4 items-center"
              >
                <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">
                  {message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!user?.mustChangePassword && (
              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block group-focus-within:text-emerald-600">Senha Atual</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-600/20 outline-none transition-all"
                    required={!user?.mustChangePassword}
                    placeholder="Sua senha atual"
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block group-focus-within:text-emerald-600">Nova Chave de Acesso</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600">
                  <Lock size={18} />
                </div>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-600/20 outline-none transition-all"
                  required
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="group">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block group-focus-within:text-emerald-600">Confirmar Nova Chave</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-600/20 outline-none transition-all"
                  required
                  placeholder="Repita a nova chave"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-tight"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-between items-center bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 px-8 rounded-2xl transition-all duration-500 shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
            >
              <span className="text-xs uppercase tracking-[0.3em]">
                {loading ? 'Sincronizando...' : 'Confirmar Alteração'}
              </span>
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => logout('Cancelamento de troca de senha')}
            className="mt-6 w-full py-3 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors border-t border-slate-100"
          >
            Abortar Protocolo e Sair
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePasswordPage;
