'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { updateProfile, getProfileHistory } from '../../../services/apiService';
import { UserCircle, Save, Key, Mail, Phone, RefreshCw, History, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const forceChange = searchParams.get('forceChange') === 'true';
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    getProfileHistory().then(res => {
      if (res.success) setHistory(res.data);
    });

    if (forceChange) {
      Swal.fire({
        title: 'Segurança Municipal',
        text: 'Sua senha foi resetada administrativamente. Você deve definir uma nova senha permanente para continuar utilizando o sistema.',
        icon: 'warning',
        confirmButtonColor: '#006644',
        confirmButtonText: 'Entendido'
      });
    }
  }, [forceChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("As senhas não conferem.");
    }

    setLoading(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Perfil atualizado com sucesso!");
        refreshUser();
        // Limpar senhas
        setFormData({ ...formData, password: '', confirmPassword: '' });
        // Recarregar histórico
        const histRes = await getProfileHistory();
        if (histRes.success) setHistory(histRes.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800 relative z-10 pb-20">
      <div className="flex items-center gap-4 text-slate-800">
         <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
            <UserCircle size={32} />
         </div>
         <div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-slate-800">Meu Perfil</h1>
            <p className="text-slate-500 text-sm font-medium">Gerenciamento de dados e segurança da conta municipal.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Formulário de Edição */}
         <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><UserCircle size={12} /> Nome Completo</label>
                     <input name="name" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-green" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Mail size={12} /> E-mail de Contato</label>
                     <input name="email" type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-green" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Phone size={12} /> Telefone</label>
                     <input name="phone" type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-green" value={formData.phone} onChange={handleChange} />
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-50 space-y-6">
                  <div className="flex items-center gap-2">
                     <Key size={18} className="text-primary-green" />
                     <h3 className="text-sm font-black uppercase text-slate-800">Alterar Senha</h3>
                     <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-md">Opcional</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                        <input name="password" type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-green" value={formData.password} onChange={handleChange} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                        <input name="confirmPassword" type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-green" value={formData.confirmPassword} onChange={handleChange} />
                     </div>
                  </div>
               </div>

               <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Salvar Alterações
               </button>
            </form>
         </div>

         {/* Histórico de Auditoria */}
         <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
               <div className="flex items-center gap-3">
                  <History size={20} className="text-primary-green" />
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-widest">Histórico de Atividade</h3>
               </div>
               
               <div className="space-y-4">
                  {history.length > 0 ? history.map((log, i) => (
                    <div key={i} className="flex gap-4 relative">
                       {i !== history.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-100"></div>}
                       <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 z-10">
                          <Clock size={10} className="text-slate-400" />
                       </div>
                       <div className="pb-4">
                          <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase">{log.action}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                       </div>
                    </div>
                  )) : (
                    <p className="text-xs font-bold text-slate-400 uppercase italic text-center py-8">Nenhuma atividade registrada</p>
                  )}
               </div>
            </div>

            <div className="bg-primary-green/5 border-2 border-primary-green/10 rounded-[2.5rem] p-8 space-y-4">
               <ShieldCheck className="text-primary-green" size={28} />
               <h4 className="text-sm font-black text-slate-800 uppercase">Soberania de Dados</h4>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  Suas informações são protegidas pelo protocolo de segurança municipal. Toda alteração crítica é auditada e registrada para sua segurança.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
