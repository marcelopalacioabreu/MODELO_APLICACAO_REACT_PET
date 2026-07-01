'use client';

import React, { useState } from 'react';
import { X, Save, Building2, Lock, Eye, GitBranch, ShieldCheck, Loader2, Plus, UserPlus, Heart, Stethoscope, Dog, Users, Activity, Calendar, FileSearch, BedDouble, Home } from 'lucide-react';
import { createLocation } from '../../services/apiService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface SubUnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  parentUnit: any;
}

const SubUnitFormModal = ({ isOpen, onClose, onSave, parentUnit }: SubUnitFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CLINICA',
    networkSettings: {
      canViewParentStock: false,
      canRequestTransfer: true,
      requireApprovalForTransfer: false,
      enabledModules: {
        reception: true,
        pets: true,
        adoptions: true,
        tutores: true,
        clinical: false,
        triage: false,
        agenda: false,
        exams: false,
        hospitalization: false,
        hotel: false
      }
    }
  });

  const handleToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      networkSettings: {
        ...prev.networkSettings,
        [field as any]: !(prev.networkSettings as any)[field]
      }
    }));
  };

  const handleModuleToggle = (module: string) => {
    setFormData(prev => ({
      ...prev,
      networkSettings: {
        ...prev.networkSettings,
        enabledModules: {
          ...prev.networkSettings.enabledModules,
          [module as any]: !(prev.networkSettings.enabledModules as any)[module]
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLocation({
        ...formData,
        parentLocation: parentUnit._id || parentUnit,
        status: 'APPROVED'
      });
      toast.success("Subunidade criada e parametrizada!");
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar subunidade");
    } finally {
      setLoading(false);
    }
  };

  const operationalModules = [
    { label: 'Recepção', key: 'reception', icon: UserPlus },
    { label: 'Gestão de Pets', key: 'pets', icon: Dog },
    { label: 'Adoções', key: 'adoptions', icon: Heart },
    { label: 'Tutores', key: 'tutores', icon: Users },
  ];

  const clinicalModules = [
    { label: 'Gestão Clínica', key: 'clinical', icon: Stethoscope },
    { label: 'Triagem', key: 'triage', icon: Activity },
    { label: 'Agenda', key: 'agenda', icon: Calendar },
    { label: 'Exames', key: 'exams', icon: FileSearch },
    { label: 'Internação', key: 'hospitalization', icon: BedDouble },
    { label: 'Hotelaria', key: 'hotel', icon: Home },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10"
          >
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary-teal text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Expandir Rede Municipal</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matriz: {parentUnit?.name}</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 
                 {/* Identidade */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Building2 size={14} /> Identidade
                    </h3>
                    <div className="space-y-4">
                       <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Nome da Unidade</label>
                          <input required type="text" placeholder="Ex: Clínica Satélite" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-teal outline-none transition-all" 
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Tipo</label>
                          <select className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none"
                            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                             <option value="CLINICA">Clínica</option>
                             <option value="CANIL">Canil/ONG</option>
                             <option value="UNIDADE_MOVEL">Unidade Móvel</option>
                          </select>
                       </div>

                       <div className="pt-4 space-y-3">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logística</h4>
                          {[
                            { label: 'Ver Estoque da Matriz', key: 'canViewParentStock', icon: Eye },
                            { label: 'Solicitar Remanejamento', key: 'canRequestTransfer', icon: GitBranch },
                            { label: 'Aprovação Obrigatória', key: 'requireApprovalForTransfer', icon: ShieldCheck }
                          ].map(item => (                            <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                               <span className="text-[9px] font-black text-slate-600 uppercase">{item.label}</span>
                               <button type="button" onClick={() => handleToggle(item.key)} className={`w-8 h-5 rounded-full relative transition-colors ${(formData.networkSettings as any)[item.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${(formData.networkSettings as any)[item.key] ? 'left-3.5' : 'left-0.5'}`}></div>
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Módulos Operacionais */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Dog size={14} /> Módulos Operacionais
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                       {operationalModules.map(mod => (
                         <div key={mod.key} onClick={() => handleModuleToggle(mod.key)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                           (formData.networkSettings.enabledModules as any)[mod.key] ? 'border-primary-teal bg-teal-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
                         }`}>
                            <div className="flex items-center gap-3">
                               <mod.icon size={18} className={(formData.networkSettings.enabledModules as any)[mod.key] ? 'text-primary-teal' : 'text-slate-300'} />
                               <span className={`text-[10px] font-black uppercase ${(formData.networkSettings.enabledModules as any)[mod.key] ? 'text-primary-teal' : 'text-slate-400'}`}>{mod.label}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${(formData.networkSettings.enabledModules as any)[mod.key] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`}></div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Módulos Clínicos */}
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Stethoscope size={14} /> Módulos Clínicos
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                       {clinicalModules.map(mod => (
                         <div key={mod.key} onClick={() => handleModuleToggle(mod.key)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                           (formData.networkSettings.enabledModules as any)[mod.key] ? 'border-primary-teal bg-teal-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
                         }`}>
                            <div className="flex items-center gap-3">
                               <mod.icon size={18} className={(formData.networkSettings.enabledModules as any)[mod.key] ? 'text-primary-teal' : 'text-slate-300'} />
                               <span className={`text-[10px] font-black uppercase ${(formData.networkSettings.enabledModules as any)[mod.key] ? 'text-primary-teal' : 'text-slate-400'}`}>{mod.label}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${(formData.networkSettings.enabledModules as any)[mod.key] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`}></div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                 <button disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-teal transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Finalizar Configuração de Subunidade
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubUnitFormModal;
