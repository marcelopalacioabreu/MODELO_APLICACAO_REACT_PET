'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Building2, MapPin, Phone, Mail, RefreshCw, GitBranch } from 'lucide-react';
import { createLocation, updateLocation, getLocations } from '../../services/apiService';
import { toast } from 'react-toastify';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: any;
}

const LocationFormModal = ({ isOpen, onClose, onSave, initialData }: LocationFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [allLocations, setAllLocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CLINICA',
    address: { 
      street: '', 
      number: '', 
      neighborhood: '',
      city: 'Juiz de Fora',
      state: 'MG'
    },
    phone: '',
    email: '',
    parentLocation: ''
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        if (res.success) {
          // Filtrar a própria unidade para evitar hierarquia circular
          const filtered = res.data.filter((l: any) => l._id !== initialData?._id);
          setAllLocations(filtered);
        }
      } catch (e) {
        console.error("Erro ao carregar unidades para hierarquia");
      }
    };
    if (isOpen) fetchLocations();
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'CLINICA',
        address: {
          street: initialData.address?.street || '',
          number: initialData.address?.number || '',
          neighborhood: initialData.address?.neighborhood || '',
          city: initialData.address?.city || 'Juiz de Fora',
          state: initialData.address?.state || 'MG'
        },
        phone: initialData.phone || '',
        email: initialData.email || '',
        parentLocation: initialData.parentLocation?._id || initialData.parentLocation || ''
      });
    } else {
      setFormData({
        name: '', type: 'CLINICA', phone: '', email: '', parentLocation: '',
        address: { street: '', number: '', neighborhood: '', city: 'Juiz de Fora', state: 'MG' }
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...((prev as any)[parent]), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Normalizar parentLocation
    const payload = { ...formData };
    if (!payload.parentLocation) delete (payload as any).parentLocation;

    try {
      if (initialData?._id) {
        await updateLocation(initialData._id, payload);
        toast.success("Unidade atualizada com sucesso!");
      } else {
        await createLocation(payload);
        toast.success("Unidade cadastrada com sucesso!");
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao salvar unidade");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-primary-green p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase text-white">{initialData ? 'Editar Unidade' : 'Nova Unidade'}</h2>
              <p className="text-primary-green/20 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-widest text-white text-white">Rede Municipal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6 text-slate-800 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Unidade *</label>
            <input name="name" required className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-green" value={formData.name} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo *</label>
              <select name="type" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.type} onChange={handleChange}>
                <option value="CANIL">Canil Municipal</option>
                <option value="CLINICA">Clínica</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="UNIDADE_MOVEL">Unidade Móvel</option>
                <option value="DEPOSITO">Depósito Central</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
              <input name="phone" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <GitBranch size={12} className="text-primary-green" /> Unidade Principal (Hierarquia)
            </label>
            <select 
              name="parentLocation" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" 
              value={formData.parentLocation} 
              onChange={handleChange}
            >
              <option value="">Sem Unidade Pai (Unidade Independente)</option>
              {allLocations.map(loc => (
                <option key={loc._id} value={loc._id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
            <p className="text-[9px] text-slate-400 font-medium italic mt-1 px-1">
              * Se selecionada, esta unidade será considerada uma subunidade para fins de logística de estoque.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-xs font-black text-primary-green uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} /> Endereço
            </h3>
            <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rua</label>
                  <input name="address.street" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium" value={formData.address.street} onChange={handleChange} />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nº</label>
                  <input name="address.number" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium" value={formData.address.number} onChange={handleChange} />
               </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-4 shrink-0">
             <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
             <button disabled={loading} className="bg-primary-green text-white px-10 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-teal transition-all shadow-xl shadow-primary-green/20 flex items-center gap-3 active:scale-95">
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'Atualizar Unidade' : 'Cadastrar Unidade'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationFormModal;
