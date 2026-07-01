'use client';

import React, { useState, useEffect } from 'react';
import { getLocations, deleteLocation } from '../../../services/apiService';
import { Building2, Plus, MapPin, Phone, Mail, CheckCircle2, RefreshCw, Settings, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import LocationFormModal from '../../../components/modals/LocationFormModal';
import Swal from 'sweetalert2';

const LocationsPage = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getLocations();
      if (res.success) setLocations(res.data);
    } catch (error) {
      toast.error("Erro ao carregar unidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (loc: any) => {
    setSelectedLocation(loc);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLocation(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Desativar Unidade?',
      text: `Deseja inativar a unidade ${name}? Ela não poderá mais receber novos atendimentos ou estoque.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Sim, inativar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteLocation(id);
        toast.success("Unidade desativada com sucesso");
        fetchData();
      } catch (error) {
        toast.error("Erro ao desativar unidade");
      }
    }
  };

  if (loading && locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Building2 className="text-primary-green animate-bounce" size={48} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Sincronizando Rede Municipal...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-fadeIn text-slate-800 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-primary-green rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Building2 size={28} />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tight uppercase">Unidades de Atendimento</h1>
                <p className="text-slate-500 text-sm font-medium">Gestão multi-clínica e canis municipais.</p>
             </div>
          </div>
          <button 
            onClick={handleCreate}
            className="bg-primary-green text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-teal transition-all shadow-xl shadow-primary-green/20 active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} /> Nova Unidade
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div key={loc._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl transition-all group border-b-4 border-b-primary-green/20">
               <div className="flex justify-between items-start mb-6 text-slate-800 text-slate-800">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                     loc.type === 'CANIL' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                     <Building2 size={24} />
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">{loc.type}</span>
                    <button 
                      onClick={() => handleDelete(loc._id, loc.name)}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                      title="Desativar Unidade"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
               </div>

               <h3 className="text-xl font-black tracking-tight mb-2 uppercase group-hover:text-primary-green transition-colors text-slate-800">{loc.name}</h3>
               
               <div className="space-y-3 mt-6 text-slate-800">
                  <div className="flex items-center gap-3 text-slate-500 text-slate-800">
                     <MapPin size={16} className="text-primary-green shrink-0" />
                     <span className="text-xs font-bold truncate text-slate-800">{loc.address?.street}, {loc.address?.number}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-slate-800">
                     <Phone size={16} className="text-primary-green shrink-0" />
                     <span className="text-xs font-bold text-slate-800">{loc.phone || 'N/A'}</span>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Ativa</span>
                  </div>
                  <button 
                    onClick={() => handleEdit(loc)}
                    className="text-[10px] font-black text-primary-green uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    <Settings size={12} /> Configurar
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      <LocationFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchData} 
        initialData={selectedLocation} 
      />
    </>
  );
};

export default LocationsPage;
