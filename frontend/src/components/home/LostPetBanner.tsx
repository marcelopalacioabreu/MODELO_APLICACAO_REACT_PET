'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLostPets } from '@/services/apiService';

const LostPetBanner = () => {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchLost = async () => {
      try {
        const res = await getLostPets();
        setLostPets(res.data || []);
      } catch (err) {
        console.error('Falha ao carregar pets perdidos');
      }
    };
    fetchLost();
  }, []);

  if (lostPets.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % lostPets.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + lostPets.length) % lostPets.length);

  const pet = lostPets[currentIndex];

  return (
    <div className="bg-rose-600 text-white py-3 relative overflow-hidden">
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
            <AlertCircle size={14} /> Alerta Urgente
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={pet._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-xs md:text-sm font-bold truncate"
            >
              <span className="opacity-80 uppercase text-[10px] mr-2">Desaparecido:</span>
              <strong className="uppercase">{pet.name}</strong> ({pet.breed}) 
              <span className="mx-2 hidden md:inline">•</span>
              <span className="hidden md:inline font-medium opacity-90 italic">Visto pela última vez em Juiz de Fora</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-xs font-black uppercase tracking-widest border-l border-white/20 pl-6">
            <a href={`tel:${pet.tutor?.phone}`} className="flex items-center gap-2 hover:text-rose-200 transition-colors">
              <Phone size={14} /> {pet.tutor?.phone}
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={prev} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
            <span className="text-[10px] font-black opacity-60">{currentIndex + 1}/{lostPets.length}</span>
            <button onClick={next} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-[-5%] w-32 h-full bg-gradient-to-r from-rose-700/50 to-transparent skew-x-[-20deg]"></div>
      </div>
    </div>
  );
};

export default LostPetBanner;
