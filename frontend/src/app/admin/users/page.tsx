'use client';

import React, { useState, useEffect } from 'react';
import { getUsers, getRoles, resetUserPassword, updateUserStatus } from '../../../services/apiService';
import { UserCog, Plus, Search, Filter, MoreVertical, Shield, CheckCircle, XCircle, Mail, CreditCard, Key, RefreshCw, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
      if (usersRes.success) setUsers(usersRes.data);
      if (rolesRes.success) setRoles(rolesRes.data);
    } catch (error) {
      toast.error("Erro ao carregar lista de usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetPassword = async (user: any) => {
    const result = await Swal.fire({
      title: 'Resetar Senha?',
      text: `Uma senha temporária será gerada para ${user.name}. O usuário será obrigado a trocá-la no próximo login.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#006644',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Sim, resetar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const res = await resetUserPassword(user._id);
        if (res.success) {
          await Swal.fire({
            title: 'Senha Resetada!',
            html: `A nova senha provisória é: <br><b class="text-2xl text-primary-green tracking-widest">${res.tempPassword}</b><br><br>Copie e envie ao usuário.`,
            icon: 'success',
            confirmButtonColor: '#006644'
          });
          fetchData();
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Erro ao resetar senha");
      }
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      const newStatus = !user.isActive;
      await updateUserStatus(user._id, newStatus);
      toast.success(`Usuário ${newStatus ? 'ativado' : 'inativado'} municipalmente!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao atualizar status");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf?.includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-pulse">
        <UserCog className="text-primary-green animate-bounce" size={40} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-primary-green">Carregando Profissionais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* Header com Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-primary-green flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-green rounded-2xl flex items-center justify-center text-white">
                <UserCog size={24} />
             </div>
             Gestão de Usuários
          </h1>
          <p className="text-slate-500 text-sm font-medium">Gerencie o acesso de profissionais e administradores.</p>
        </div>
        <button className="bg-primary-green text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-primary-teal transition-all shadow-xl shadow-primary-green/20 active:scale-95">
          <Plus size={18} /> Novo Usuário
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, CPF ou e-mail..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={fetchData} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors text-sm font-bold">
          <RefreshCw size={18} /> Sincronizar
        </button>
      </div>

      {/* Grid de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className={`bg-white rounded-[2rem] border-2 transition-all overflow-hidden group ${user.isActive ? 'border-slate-50 shadow-sm hover:shadow-xl hover:border-primary-green/20' : 'border-red-50 bg-red-50/10 grayscale'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${user.isActive ? 'bg-primary-green/10 text-primary-green' : 'bg-red-100 text-red-400'}`}>
                  <UserCog size={28} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-slate-800 tracking-tight truncate uppercase">{user.name}</h3>
                <div className="flex items-center gap-2 text-slate-400">
                  <Shield size={14} className="text-primary-green" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{user.role?.name || 'Sem Função'}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><CreditCard size={12} /></div>
                  <span className="text-xs font-bold tracking-tight">{user.cpf || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                   <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Mail size={12} /></div>
                  <span className="text-xs font-bold truncate lowercase">{user.email || 'sem e-mail'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50/50 p-4 grid grid-cols-2 gap-2 border-t border-slate-50">
              <button 
                onClick={() => handleResetPassword(user)}
                className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <Key size={12} /> Resetar Senha
              </button>
              <button 
                onClick={() => handleToggleStatus(user)}
                className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${
                  user.isActive 
                  ? 'bg-white border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500' 
                  : 'bg-white border-green-100 text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600'
                }`}
              >
                {user.isActive ? <PowerOff size={12} /> : <Power size={12} />}
                {user.isActive ? 'Desativar' : 'Reativar'}
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
             <UserCog className="mx-auto text-slate-200 mb-4" size={60} />
             <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">Nenhum usuário encontrado</h3>
             <p className="text-slate-400 text-sm mt-1">Tente ajustar seus termos de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
