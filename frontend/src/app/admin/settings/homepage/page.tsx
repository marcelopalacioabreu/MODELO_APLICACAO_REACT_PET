'use client';

import React, { useState, useEffect } from 'react';
import { getHomeConfig, updateHomeConfig } from '../../../../services/apiService';
import { 
  Layout, 
  Save, 
  Eye, 
  EyeOff, 
  MoveVertical, 
  Settings, 
  Globe, 
  RefreshCw,
  Info,
  Type,
  AlignLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const HomePageSettings = () => {
  const [config, setHomeConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfig = async () => {
    try {
      const res = await getHomeConfig();
      if (res.success) setHomeConfig(res.data);
    } catch (err) {
      toast.error("Erro ao carregar arquitetura do site.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleToggleSection = (sectionId: string) => {
    setHomeConfig((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: any) => 
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      )
    }));
  };

  const handleUpdateField = (sectionId: string, field: string, value: string) => {
    setHomeConfig((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: any) => 
        s.id === sectionId ? { ...s, [field]: value } : s
      )
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHomeConfig(config);
      toast.success("Conteúdo Municipal Publicado!");
      fetchConfig();
    } catch (err) {
      toast.error("Erro ao publicar alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <RefreshCw className="text-blue-600 animate-spin" size={40} />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sincronizando Conteúdo...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-fadeIn pb-20">
      {/* Header Industrial */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
            <Globe size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Gestão do Portal</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1 italic">Personalização de início e conteúdo dinâmico.</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-emerald-700 transition-all shadow-2xl flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          Salvar Configuração
        </button>
      </div>

      {/* Ajuda de Estilização */}
      <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[3rem] flex items-start gap-6">
         <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"><Info size={24} /></div>
         <div>
            <h3 className="font-black text-emerald-900 uppercase text-xs tracking-widest mb-2">Estilização Inteligente (Padrão EMTEC)</h3>
            <p className="text-sm text-emerald-700 font-medium leading-relaxed">
               Utilize as tags abaixo nos títulos e subtítulos para aplicar design municipal instantâneo:<br/>
               <span className="font-black text-emerald-900 bg-white px-2 py-0.5 rounded-md text-[10px] mr-2">{"{{color:green-600}}...{{/color}}"}</span>
               <span className="font-black text-emerald-900 bg-white px-2 py-0.5 rounded-md text-[10px] mr-2">{"{{gradient:from-green to-teal}}...{{/gradient}}"}</span>
               <span className="font-black text-emerald-900 bg-white px-2 py-0.5 rounded-md text-[10px]">{"(Nova Linha)"}</span>
            </p>
         </div>
      </div>

      {/* Grid de Seções */}
      <div className="grid grid-cols-1 gap-8">
         {config.sections.map((section: any) => (
            <div key={section.id} className={`bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all ${!section.isVisible ? 'opacity-50 bg-slate-50' : ''}`}>
               <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><Layout size={18} /></div>
                     <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{section.id}</h2>
                  </div>
                  <button 
                    onClick={() => handleToggleSection(section.id)}
                    className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${section.isVisible ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                  >
                     {section.isVisible ? <Eye size={16} className="inline mr-2" /> : <EyeOff size={16} className="inline mr-2" />}
                     {section.isVisible ? 'Visível' : 'Oculto'}
                  </button>
               </div>

               <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        <Type size={14} className="text-blue-500" /> Título da Seção
                     </label>
                     <textarea 
                        value={section.title}
                        onChange={(e) => handleUpdateField(section.id, 'title', e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 transition-all"
                        rows={2}
                     />
                  </div>
                  <div className="space-y-4">
                     <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        <AlignLeft size={14} className="text-blue-500" /> Subtítulo / Descritivo
                     </label>
                     <textarea 
                        value={section.subtitle}
                        onChange={(e) => handleUpdateField(section.id, 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-medium text-slate-500 outline-none focus:border-blue-500 transition-all"
                        rows={2}
                     />
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default HomePageSettings;
