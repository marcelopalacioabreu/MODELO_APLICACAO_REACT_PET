'use client';

import React, { useState, useEffect } from 'react';
import { getLostPets } from '@/services/apiService';
import { Search, MapPin, Phone, AlertTriangle, Loader2, Dog } from 'lucide-react';
import { motion } from 'framer-motion';

const LostPetsSection = () => {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLostPets();
  }, []);

  const loadLostPets = async () => {
    try {
      const res = await getLostPets();
      setLostPets(res.data);
    } catch (err) {
      console.error("Erro ao carregar alertas", err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && lostPets.length === 0) return null;

  return (
    <section id="lost-pets" className="py-24 bg-rose-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <AlertTriangle size={14} /> Alerta de Utilidade Pública
            </div>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
              PETS <span className="text-rose-600">Perdidos</span> em Juiz de Fora
            </h2>
            <p className="text-slate-500 font-medium italic mt-4">Ajude nossos amigos a voltarem para casa. Se você viu algum deles, entre em contato imediatamente.</p>
          </div>
          <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3">
            Reportar Animal Perdido <Dog size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {lostPets.map((pet, idx) => (
              <motion.div 
                key={pet._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] shadow-xl shadow-rose-200/20 border border-white overflow-hidden group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                   <img 
                     src={pet.photoUrl || 'https://images.unsplash.com/photo-1517423440428-a5a00ad1e390?auto=format&fit=crop&q=80'} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute top-4 right-4 px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg animate-pulse">
                     Desaparecido
                   </div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{pet.name}</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <MapPin size={14} className="text-rose-500" /> {pet.lastSeenLocation || 'Bairro Não Informado'}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <Phone size={14} className="text-rose-500" /> {pet.tutor?.phone || '(32) 99999-0000'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 italic mb-6">"{pet.description || 'Visto pela última vez próximo ao centro.'}"</p>
                  <button className="w-full py-4 bg-rose-50 text-rose-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                    Ver Detalhes
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LostPetsSection;
