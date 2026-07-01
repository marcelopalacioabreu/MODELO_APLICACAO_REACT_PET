'use client';

import React, { useState, useEffect } from 'react';
import { getRoles, getPermissions, getFunctionalities, updateRolePermissions } from '../../../services/apiService';
import { ShieldCheck, Lock, Users, ChevronRight, Activity, CheckCircle2, Box, Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const PermissionsPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [functionalities, setFunctionalities] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [activePermissionIds, setActivePermissionIds] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permRes, funcRes] = await Promise.all([
        getRoles(), 
        getPermissions(),
        getFunctionalities()
      ]);
      if (rolesRes.success) setRoles(rolesRes.data);
      if (permRes.success) setPermissions(permRes.data);
      if (funcRes.success) setFunctionalities(funcRes.data);
    } catch (error) {
      toast.error("Falha ao sincronizar dados administrativos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      // Elite: Garantir extração de IDs limpa
      const ids = selectedRole.permissions?.map((p: any) => typeof p === 'string' ? p : p._id) || [];
      setActivePermissionIds(ids);
    } else {
      setActivePermissionIds([]);
    }
  }, [selectedRole]);

  const handleTogglePermission = (permissionId: string) => {
    setActivePermissionIds(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      // Enviar os IDs para o backend
      const res = await updateRolePermissions(selectedRole._id, activePermissionIds);
      if (res.success) {
        toast.success(`Matriz de ${selectedRole.name} atualizada!`);
        await fetchData(); // Recarregar tudo para sincronizar
      }
    } catch (error) {
      toast.error("Erro ao salvar permissões");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><RefreshCw className="animate-spin text-primary-green" size={32} /></div>;

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Gestão de Acessos</h1>
          <p className="text-slate-500 text-sm font-medium">Controle dinâmico de Funcionalidades e Permissões.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <RefreshCw size={14} /> Sincronizar Base
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Lista de Funções */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                <Users size={16} className="text-primary-green" /> Cargos Municipais
              </h2>
            </div>
            <div className="p-2 space-y-1">
              {roles.map((role) => (
                <button
                  key={role._id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    selectedRole?._id === role._id 
                    ? 'bg-slate-900 text-white shadow-xl translate-x-2' 
                    : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-black uppercase tracking-tight">{role.name}</p>
                    <p className={`text-[9px] font-bold ${selectedRole?._id === role._id ? 'text-primary-green' : 'text-slate-400'}`}>
                      {role.permissionKeys?.length || 0} CHAVES ATIVAS
                    </p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matriz de Permissões */}
        <div className="lg:col-span-3">
          {selectedRole ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
                <div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{selectedRole.name}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Escopo {selectedRole.scope}</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="bg-primary-green text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-primary-green/20 active:scale-95 disabled:opacity-50 flex items-center gap-3">
                  {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Salvar Alterações
                </button>
              </div>

              <div className="p-8 space-y-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {functionalities.map((func) => (
                  <div key={func._id} className="space-y-6">
                    <div className="flex items-center gap-4 border-b-2 border-slate-50 pb-2">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary-green"><Box size={20} /></div>
                      <div>
                        <h3 className="text-base font-black text-slate-800 uppercase">{func.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{func.module} • {func.key}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* FILTRO DE ELITE: Mostrar apenas permissões que pertencem a esta funcionalidade */}
                      {permissions.filter(p => p.functionality === func._id || p.functionality?._id === func._id).map((perm) => {
                        const isChecked = activePermissionIds.includes(perm._id);
                        return (
                          <div 
                            key={perm._id}
                            onClick={() => handleTogglePermission(perm._id)}
                            className={`p-5 rounded-[1.5rem] border-2 transition-all flex items-start gap-4 cursor-pointer hover:shadow-lg ${
                              isChecked ? 'border-primary-green bg-green-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
                            }`}
                          >
                            <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isChecked ? 'bg-primary-green border-primary-green text-white' : 'border-slate-200 bg-white'
                            }`}>
                              {isChecked && <CheckCircle2 size={14} />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-black uppercase ${isChecked ? 'text-primary-green' : 'text-slate-700'}`}>{perm.name}</p>
                              <code className="text-[9px] font-bold text-slate-400 block mb-1">{perm.key}</code>
                              <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{perm.description || 'Sem descrição técnica municipal.'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[60vh] bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
               <ShieldCheck size={64} className="text-slate-200 mb-4" />
               <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">Selecione um Cargo</h3>
               <p className="text-sm text-slate-400 font-medium max-w-xs mt-2">Escolha uma função à esquerda para gerenciar sua matriz de poder no sistema municipal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
