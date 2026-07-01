'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Loader2, 
  ShieldCheck, 
  UserCog, 
  UserPlus,
  Dog,
  Heart,
  Stethoscope,
  Activity,
  Calendar,
  FileSearch,
  BedDouble,
  Home,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { createNetworkUser, updateNetworkUser } from '@/services/apiService';

interface NetworkUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  initialData?: any; 
}

const NetworkUserModal = ({ isOpen, onClose, unit, initialData }: NetworkUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [authorityLevel, setAuthorityLevel] = useState<'MANAGER' | 'OPERATOR'>('OPERATOR');
  const [enabledModules, setEnabledModules] = useState<any>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          cpf: initialData.cpf || '',
          password: '' 
        });
        setAuthorityLevel(initialData.role?.name === 'UNIT_ADMIN' ? 'MANAGER' : 'OPERATOR');
        setEnabledModules(initialData.enabledModules || {});
      } else {
        setFormData({ name: '', email: '', cpf: '', password: '' });
        setAuthorityLevel('OPERATOR');
        setEnabledModules(unit?.networkSettings?.enabledModules || {});
      }
    }
  }, [isOpen, initialData, unit]);

  const handleModuleToggle = (moduleKey: string) => {
    setEnabledModules((prev: any) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await updateNetworkUser(initialData._id, {
          authorityLevel,
          enabledModules
        });
        toast.success("Operador atualizado com sucesso!");
      } else {
        await createNetworkUser({
          ...formData,
          unitId: unit._id,
          authorityLevel,
          enabledModules
        });
        toast.success(`Operador vinculado a ${unit.name}`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao configurar operador.");
    } finally {
      setLoading(false);
    }
  };

  // Lista Completa de Módulos (Paridade com Unidade)
  const modulesList = [
    { label: 'Recepção', key: 'reception', icon: UserPlus },
    { label: 'Pets', key: 'pets', icon: Dog },
    { label: 'Adoções', key: 'adoptions', icon: Heart },
    { label: 'Tutores', key: 'tutores', icon: User },
    { label: 'Estoque', key: 'inventory', icon: Box },
    { label: 'Clínica', key: 'clinical', icon: Stethoscope },
    { label: 'Triagem', key: 'triage', icon: Activity },
    { label: 'Agenda', key: 'agenda', icon: Calendar },
    { label: 'Exames', key: 'exams', icon: FileSearch },
    { label: 'Internação', key: 'hospitalization', icon: BedDouble },
    { label: 'Hotelaria', key: 'hotel', icon: Home },
    { label: 'Monitoramento', key: 'network_monitoring', icon: Activity },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
            className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-slate-100 flex flex-col my-auto"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    {initialData ? <UserCog size={24} /> : <UserPlus size={24} />}
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{initialData ? 'Ajustar Privilégios' : 'Novo Operador'}</h2>
                    <p className="text-[10px] font-bold text-primary-teal uppercase tracking-widest">{unit?.name}</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nível de Autoridade</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button type="button" onClick={() => setAuthorityLevel('OPERATOR')}
                            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${authorityLevel === 'OPERATOR' ? 'border-primary-teal bg-teal-50/30' : 'border-slate-50 bg-slate-50'}`}>
                             <Shield size={16} className={authorityLevel === 'OPERATOR' ? 'text-primary-teal' : 'text-slate-400'} />
                             <span className={`text-[10px] font-black uppercase ${authorityLevel === 'OPERATOR' ? 'text-primary-teal' : 'text-slate-500'}`}>Operacional</span>
                          </button>
                          <button type="button" onClick={() => setAuthorityLevel('MANAGER')}
                            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${authorityLevel === 'MANAGER' ? 'border-primary-teal bg-teal-50/30' : 'border-slate-50 bg-slate-50'}`}>
                             <UserCog size={16} className={authorityLevel === 'MANAGER' ? 'text-primary-teal' : 'text-slate-400'} />
                             <span className={`text-[10px] font-black uppercase ${authorityLevel === 'MANAGER' ? 'text-primary-teal' : 'text-slate-500'}`}>Gestor Local</span>
                          </button>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <input required disabled={!!initialData} type="text" placeholder="Nome Completo" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-teal outline-none transition-all disabled:opacity-50" 
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       <div className="grid grid-cols-2 gap-4">
                          <input required disabled={!!initialData} type="email" placeholder="E-mail" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none disabled:opacity-50" 
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                          <input required disabled={!!initialData} type="text" placeholder="CPF" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none disabled:opacity-50" 
                            value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                       </div>
                       {!initialData && (
                          <input required type="password" placeholder="Senha Inicial" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none" 
                          value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                       )}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck size={14} className="text-primary-teal" /> Privilégios Individuais
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {modulesList.map(mod => {
                          const unitEnabled = unit?.networkSettings?.enabledModules?.[mod.key];
                          const userEnabled = enabledModules[mod.key];
                          return (
                            <div key={mod.key} 
                              onClick={() => unitEnabled && handleModuleToggle(mod.key)}
                              className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                                !unitEnabled ? 'opacity-30 grayscale cursor-not-allowed border-slate-50 bg-slate-50' :
                                userEnabled ? 'border-primary-teal bg-teal-50/20 cursor-pointer' : 'border-slate-50 bg-white cursor-pointer hover:border-slate-200'
                              }`}
                            >
                               <div className="flex items-center gap-2">
                                  <mod.icon size={14} className={userEnabled ? 'text-primary-teal' : 'text-slate-300'} />
                                  <span className={`text-[8px] font-black uppercase ${userEnabled ? 'text-slate-800' : 'text-slate-400'}`}>{mod.label}</span>
                               </div>
                               <div className={`w-8 h-4 rounded-full relative transition-colors ${userEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${userEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                               </div>
                            </div>
                          );
                       })}
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                 <button disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-teal transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {initialData ? 'Sincronizar Permissões de Operador' : 'Vincular Operador à Unidade'}
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NetworkUserModal;
