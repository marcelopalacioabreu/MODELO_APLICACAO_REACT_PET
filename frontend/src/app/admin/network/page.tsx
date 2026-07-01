'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Plus, 
  Users, 
  Settings, 
  ShieldCheck, 
  Building2, 
  ArrowRight,
  ChevronRight,
  MoreVertical,
  Activity,
  Lock,
  Eye,
  RefreshCw,
  UserPlus,
  Link as LinkIcon,
  Dog,
  Heart,
  Stethoscope,
  Calendar,
  FileSearch,
  BedDouble,
  Home,
  User,
  Key,
  ShieldAlert,
  Power,
  CheckCircle2
} from 'lucide-react';
import { 
  getMyNetwork, 
  updateUnitNetworkSettings, 
  getLocations, 
  updateLocation,
  getUnitUsers,
  updateUserStatus,
  resetUserPassword
} from '@/services/apiService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import NetworkUserModal from '@/components/modals/NetworkUserModal';
import SubUnitFormModal from '@/components/modals/SubUnitFormModal';
import Link from 'next/link';

const NetworkPage = () => {
  const { user } = useAuth();
  const [network, setNetwork] = useState<any[]>([]);
  const [unitUsers, setUnitUsers] = useState<any[]>([]);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSubUnitModalOpen, setIsSubUnitModalOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyNetwork();
      if (res.success) {
        setNetwork(res.data);
        if (selectedUnit) {
          const updated = res.data.find((u: any) => u._id === selectedUnit._id);
          if (updated) setSelectedUnit(updated);
        }
      }
      
      const locRes = await getLocations();
      if (locRes.success) {
        const currentNetworkIds = res.data.map((u: any) => u._id);
        const available = locRes.data.filter((l: any) => 
          !currentNetworkIds.includes(l._id) && l._id !== (user?.unit?._id || user?.unit)
        );
        setAllLocations(available);
      }
    } catch (err) {
      toast.error("Erro ao sincronizar topologia de rede.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitUsers = async (unitId: string) => {
    setUsersLoading(true);
    try {
      const res = await getUnitUsers(unitId);
      if (res.success) setUnitUsers(res.data);
    } catch (err) {
      toast.error("Erro ao carregar operadores.");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedUnit) fetchUnitUsers(selectedUnit._id);
    else setUnitUsers([]);
  }, [selectedUnit]);

  const handleToggleSetting = async (unitId: string, field: string, currentValue: boolean, isModule = false) => {
    try {
      const unit = network.find(u => u._id === unitId);
      let newSettings = { ...unit.networkSettings };
      
      if (isModule) {
        newSettings.enabledModules = {
          ...(newSettings.enabledModules || {}),
          [field]: !currentValue
        };
      } else {
        newSettings[field] = !currentValue;
      }

      await updateUnitNetworkSettings(unitId, newSettings);
      toast.success("Parâmetros sincronizados.");
      fetchData();
    } catch (err) {
      toast.error("Falha ao atualizar parâmetros.");
    }
  };

  const handleEditUser = (u: any) => {
    setSelectedUser(u);
    setIsUserModalOpen(true);
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      toast.success(currentStatus ? "Acesso revogado." : "Acesso restabelecido.");
      fetchUnitUsers(selectedUnit._id);
    } catch (err) {
      toast.error("Erro ao alterar status do operador.");
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm("Confirmar reset de senha? Uma senha provisória será gerada.")) return;
    try {
      const res = await resetUserPassword(userId);
      if (res.success) {
        alert(`Senha resetada com sucesso!\nNova Senha: ${res.tempPassword}\n\nPor favor, informe ao colaborador.`);
        fetchUnitUsers(selectedUnit._id);
      }
    } catch (err) {
      toast.error("Erro ao resetar senha.");
    }
  };

  const myId = user?.unit?._id || user?.unit;
  const subUnits = network.filter(u => 
    u.parentLocation === myId || u.parentLocation?._id === myId
  );

  const modules = [
    { label: 'Recepção', key: 'reception', icon: UserPlus },
    { label: 'Pets', key: 'pets', icon: Dog },
    { label: 'Adoções', key: 'adoptions', icon: Heart },
    { label: 'Tutores', key: 'tutores', icon: Users },
    { label: 'Clínica', key: 'clinical', icon: Stethoscope },
    { label: 'Triagem', key: 'triage', icon: Activity },
    { label: 'Agenda', key: 'agenda', icon: Calendar },
    { label: 'Exames', key: 'exams', icon: FileSearch },
    { label: 'Internação', key: 'hospitalization', icon: BedDouble },
    { label: 'Hotelaria', key: 'hotel', icon: Home },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <GitBranch className="text-primary-teal" size={32} />
            Orquestração de Rede
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Logística PJF</p>
            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
            <p className="text-primary-teal text-[10px] font-black uppercase tracking-[0.2em]">{user?.unit?.name || 'Sede Central'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setIsLinking(!isLinking)} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <LinkIcon size={16} /> {isLinking ? 'Cancelar' : 'Vincular Unidade'}
           </button>
           <button onClick={() => setIsSubUnitModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-primary-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg">
              <Plus size={16} /> Nova Subunidade
           </button>
        </div>
      </div>

      {isLinking && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary-teal/5 border-2 border-dashed border-primary-teal/20 rounded-[2.5rem] p-8">
           <h3 className="text-sm font-black text-slate-900 uppercase mb-4 italic">Selecione uma unidade municipal para trazer para sua rede:</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allLocations.map(loc => (
                <button key={loc._id} onClick={() => updateLocation(loc._id, { parentLocation: user?.unit?._id || user?.unit }).then(() => fetchData())} className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-primary-teal transition-all text-left">
                   <p className="text-xs font-black text-slate-800">{loc.name}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{loc.type}</p>
                </button>
              ))}
           </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Coluna 1: Topologia */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2"><Activity size={12} /> Hierarquia</h3>
              <div className="space-y-4">
                 <div className="p-5 bg-slate-900 rounded-[1.5rem] text-white shadow-xl">
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">Unidade Logada</p>
                    <h4 className="text-sm font-black uppercase tracking-tight truncate">{user?.unit?.name || 'Matriz'}</h4>
                 </div>
                 <div className="flex justify-center py-1"><div className="h-6 w-0.5 border-l-2 border-dashed border-slate-200"></div></div>
                 <div className="space-y-2">
                    {subUnits.map((sub) => (
                      <div key={sub._id} onClick={() => setSelectedUnit(sub)} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between group ${selectedUnit?._id === sub._id ? 'border-primary-teal bg-teal-50/30' : 'border-slate-50 bg-white'}`}>
                         <h5 className="text-[10px] font-black text-slate-800 uppercase truncate">{sub.name}</h5>
                         <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Colunas 2-4: Comando */}
        <div className="lg:col-span-3 space-y-6">
           {selectedUnit ? (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                
                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                   <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
                      <div className="w-16 h-16 bg-primary-teal text-white rounded-2xl flex items-center justify-center shadow-lg"><Building2 size={32} /></div>
                      <div>
                         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedUnit.name}</h2>
                         <p className="text-[10px] font-black text-primary-teal uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-1">Configuração de Rede PJF</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><GitBranch size={14} /> Logística</h4>
                         <div className="space-y-3">
                            {[
                              { label: 'Ver Estoque da Mãe', key: 'canViewParentStock', icon: Eye },
                              { label: 'Pedir Remanejamento', key: 'canRequestTransfer', icon: GitBranch },
                              { label: 'Aprovação Obrigatória', key: 'requireApprovalForTransfer', icon: ShieldCheck }
                            ].map(item => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <span className="text-[10px] font-black text-slate-700 uppercase">{item.label}</span>
                                 <button onClick={() => handleToggleSetting(selectedUnit._id, item.key, selectedUnit.networkSettings?.[item.key])}
                                   className={`w-10 h-6 rounded-full relative transition-colors ${selectedUnit.networkSettings?.[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedUnit.networkSettings?.[item.key] ? 'left-5' : 'left-1'}`}></div>
                                 </button>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Lock size={14} /> Módulos</h4>
                         <div className="grid grid-cols-2 gap-3">
                            {modules.map(mod => (
                               <div key={mod.key} onClick={() => handleToggleSetting(selectedUnit._id, mod.key, selectedUnit.networkSettings?.enabledModules?.[mod.key], true)}
                                 className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedUnit.networkSettings?.enabledModules?.[mod.key] ? 'border-primary-teal/30 bg-teal-50/50' : 'border-slate-50 opacity-60'}`}>
                                  <span className="text-[8px] font-black uppercase text-slate-700 truncate">{mod.label}</span>
                                  <div className={`w-1.5 h-1.5 rounded-full ${selectedUnit.networkSettings?.enabledModules?.[mod.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                         <Users className="text-primary-teal" size={24} /> Comando Local
                      </h3>
                      <button onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-teal transition-all active:scale-95 shadow-lg">
                         <UserPlus size={16} /> Novo Operador
                      </button>
                   </div>

                   <div className="overflow-hidden">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="border-b border-slate-50">
                               <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Operador</th>
                               <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">CPF / E-mail</th>
                               <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Autoridade</th>
                               <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right px-2">Ações</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {unitUsers.map(u => (
                               <tr key={u._id} className="group hover:bg-slate-50/50 transition-colors">
                                  <td className="py-5 px-2">
                                     <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${u.isActive ? 'bg-primary-teal' : 'bg-slate-300'}`}><User size={14} /></div>
                                        <div>
                                           <p className="text-xs font-black text-slate-800 uppercase">{u.name}</p>
                                           <p className={`text-[8px] font-bold uppercase tracking-tighter ${u.isActive ? 'text-emerald-500' : 'text-rose-400'}`}>{u.isActive ? 'Ativo na Rede' : 'Acesso Revogado'}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="py-5 px-2">
                                     <p className="text-[10px] font-bold text-slate-600">{u.cpf}</p>
                                     <p className="text-[9px] font-medium text-slate-400">{u.email}</p>
                                  </td>
                                  <td className="py-5 px-2">
                                     <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase">{u.role?.name || 'OPERADOR'}</span>
                                  </td>
                                  <td className="py-5 px-2 text-right">
                                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditUser(u)} title="Ajustar Privilégios" className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-primary-teal hover:border-teal-200 transition-all shadow-sm"><Settings size={14} /></button>
                                        <button onClick={() => handleResetPassword(u._id)} title="Resetar Senha" className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm"><Key size={14} /></button>
                                        <button onClick={() => handleToggleUserStatus(u._id, u.isActive)} title={u.isActive ? 'Inativar' : 'Ativar'} className={`p-2 border rounded-lg transition-all shadow-sm ${u.isActive ? 'bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'}`}>
                                           {u.isActive ? <Power size={14} /> : <CheckCircle2 size={14} />}
                                        </button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

             </motion.div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[3rem] p-20 opacity-30 text-center">
                <GitBranch size={64} className="mb-6 mx-auto" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Selecione uma subunidade</h3>
                <p className="text-sm font-bold uppercase tracking-widest mt-2 italic">Governança Logística e Clínica Centralizada</p>
             </div>
           )}
        </div>
      </div>

      <NetworkUserModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); fetchUnitUsers(selectedUnit._id); }} unit={selectedUnit} initialData={selectedUser} />
      <SubUnitFormModal isOpen={isSubUnitModalOpen} onClose={() => setIsSubUnitModalOpen(false)} onSave={fetchData} parentUnit={user?.unit} />
    </div>
  );
};

export default NetworkPage;
