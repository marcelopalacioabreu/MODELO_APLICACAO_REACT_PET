'use client';

import React, { useState, useEffect } from 'react';
import { getAdoptablePets } from '@/services/apiService';
import { Heart, Info, Loader2, Sparkles, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseEliteText } from '@/utils/textParser';
import Link from 'next/link';

import AdoptionModal from './AdoptionModal';

interface AdoptionSectionProps {
  title?: string;
  subtitle?: string;
}

const AdoptionSection = ({ title, subtitle }: AdoptionSectionProps) => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdoptablePets();
  }, []);

  const handleOpenModal = (pet: any) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const fetchAdoptablePets = async () => {
    try {
      const res = await getAdoptablePets();
      setPets(res.data);
    } catch (err) {
      console.error("Erro ao carregar vitrine de adoção");
    } finally {
      setLoading(false);
    }
  };

  if (!loading && pets.length === 0) return null;

  return (
    <section id="adocao" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} /> Amor que Transforma
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
              {parseEliteText(title || "Encontre seu Novo Melhor Amigo")}
            </h2>
            <p className="text-slate-500 font-medium italic mt-6">
              {parseEliteText(subtitle || "Conheça os animais resgatados que aguardam por um lar cheio de amor.")}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pets.map((pet, idx) => (
              <motion.div 
                key={pet._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden">
                   <img 
                     src={pet.photos?.[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800'} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     alt={pet.name}
                   />
                   <div className="absolute top-6 left-6 px-4 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                     Pronto para Adoção
                   </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{pet.name}</h3>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                       <Heart size={20} fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                     <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-100">{pet.species}</span>
                     <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-100">{pet.breed}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                     <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Home size={14} className="text-emerald-500" /> Residência: {pet.currentBed?.name || 'Unidade Municipal'}
                     </div>
                  </div>

                  <button 
                    onClick={() => handleOpenModal(pet)}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    Tenho Interesse <Info size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AdoptionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pet={selectedPet}
        />
      </div>
    </section>
  );
};

export default AdoptionSection;
