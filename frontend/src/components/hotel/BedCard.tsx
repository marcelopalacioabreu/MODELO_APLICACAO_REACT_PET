'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Settings, Dog, XCircle, Plus, Move, GripVertical } from 'lucide-react';
import { updateBedPosition, updateBedStatus } from '@/services/apiService';
import { toast } from 'react-toastify';

interface BedCardProps {
  bed: any;
  isEditingLayout: boolean;
  onEdit: () => void;
  onCheckIn: () => void;
  onPetClick: (pet: any) => void; // Unificado para onPetClick
  onRefresh: () => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  readonly?: boolean;
}

const BedCard: React.FC<BedCardProps> = ({ 
  bed, 
  isEditingLayout, 
  onEdit, 
  onCheckIn, 
  onPetClick, 
  onRefresh,
  canvasRef,
  readonly = false 
}) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500';
      case 'OCCUPIED': return 'bg-rose-500';
      case 'MAINTENANCE': return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const handleBedDragEnd = async (event: any, info: any) => {
    if (!isEditingLayout || readonly) return;
    const newX = (bed.posX || 0) + info.offset.x;
    const newY = (bed.posY || 0) + info.offset.y;
    try {
      await updateBedPosition(bed._id, newX, newY);
    } catch (err) {
      console.error("Erro ao salvar posição");
    }
  };

  const handleCheckout = async (e: React.MouseEvent, petId: string) => {
    e.stopPropagation();
    if (readonly || isEditingLayout) return;
    if (!confirm("Remover animal desta baia?")) return;
    try {
      await updateBedStatus(bed._id, 'AVAILABLE', petId, 'REMOVE');
      toast.success("Baia liberada!");
      onRefresh();
    } catch (err) {
      toast.error("Erro no checkout.");
    }
  };

  return (
    <motion.div 
      drag={isEditingLayout && !readonly}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: 0, top: 0, right: 3760, bottom: 2700 }} // Muralhas do Canvas 4000x3000
      onDragEnd={handleBedDragEnd}
      initial={{ x: bed.posX || 0, y: bed.posY || 0 }}
      animate={{ x: bed.posX || 0, y: bed.posY || 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{ position: 'absolute', zIndex: isEditingLayout ? 50 : 10 }}
      id={`bed-${bed._id}`}
      className="bed-element"
    >
      <div className={`bg-white rounded-[2rem] border-2 shadow-2xl w-60 relative group transition-all ${
        isEditingLayout ? 'border-primary-green ring-4 ring-primary-green/10 cursor-move' : 'border-slate-100'
      }`}>
        <div className={`absolute top-0 left-0 w-full h-1.5 ${getStatusColor(bed.status)} rounded-t-full`} />
        
        <div className="flex justify-between items-start p-5 pb-2">
          <div className={`p-2.5 rounded-2xl bg-slate-50 ${getStatusColor(bed.status).replace('bg-', 'text-')} shadow-sm`}>
            {isEditingLayout ? <Move size={18} /> : <Home size={18} />}
          </div>
          {!readonly && !isEditingLayout && (
             <button onClick={onEdit} className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                <Settings size={16} />
             </button>
          )}
        </div>

        <div className="px-6 pb-2 space-y-0.5">
           <h4 className="text-xs font-black text-slate-900 uppercase tracking-tighter truncate">{bed.name}</h4>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{bed.type?.replace('_', ' ')}</p>
        </div>

        <div className="mt-5 space-y-2.5">
           {/* Indicador de Ocupação Industrial */}
           <div className="px-1 mb-2">
              <div className="flex justify-between items-center mb-1.5">
                 <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Taxa de Ocupação</span>
                 <span className={`text-[9px] font-black uppercase ${
                    (bed.currentPets?.length || 0) >= bed.capacity ? 'text-rose-500' : 
                    (bed.currentPets?.length || 0) > 0 ? 'text-amber-500' : 'text-emerald-500'
                 }`}>
                    {bed.currentPets?.length || 0} / {bed.capacity}
                 </span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((bed.currentPets?.length || 0) / bed.capacity) * 100}%` }}
                    className={`h-full rounded-full ${
                       (bed.currentPets?.length || 0) >= bed.capacity ? 'bg-rose-500' : 
                       (bed.currentPets?.length || 0) > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                 />
              </div>
           </div>

           {bed.currentPets?.map((pet: any) => (
             <motion.div 
                key={pet._id} 
                drag={!isEditingLayout && !readonly}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1} 
                onDragStart={(e) => e.stopPropagation()}
                onDragEnd={(e, info) => {
                   const event = new CustomEvent('pet-reallocate', { 
                      detail: { pet, fromBedId: bed._id, point: info.point } 
                   });
                   window.dispatchEvent(event);
                }}
                whileDrag={{ 
                  scale: 1.2, 
                  zIndex: 999999, 
                  boxShadow: "0 40px 80px -12px rgba(0,0,0,0.8)",
                  cursor: "grabbing"
                }}
                className={`flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 group/pet hover:bg-white hover:border-primary-green/30 transition-all ${
                   isEditingLayout ? 'opacity-50 grayscale' : 'cursor-grab active:cursor-grabbing shadow-sm'
                }`}
             >
                <div onClick={(e) => { e.stopPropagation(); onPetClick(pet); }} className="flex items-center gap-3 flex-1 overflow-hidden">
                   <div className="w-8 h-8 bg-primary-green rounded-xl flex items-center justify-center text-[10px] text-white font-black">{pet.name.charAt(0)}</div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight truncate w-24">{pet.name}</p>
                      {!isEditingLayout && <p className="text-[6px] font-bold text-slate-400 uppercase flex items-center gap-1"><GripVertical size={8}/> Arrastar</p>}
                   </div>
                </div>
                {!readonly && !isEditingLayout && (
                   <button onClick={(e) => handleCheckout(e, pet._id)} className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover/pet:opacity-100 transition-all">
                      <XCircle size={14} />
                   </button>
                )}
             </motion.div>
           ))}

           {(!bed.currentPets || bed.currentPets.length < bed.capacity) && !readonly && !isEditingLayout && (
             <button 
               onClick={onCheckIn}
               className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[8px] font-black text-slate-300 uppercase hover:border-primary-green hover:text-primary-green hover:bg-emerald-50/10 transition-all flex items-center justify-center gap-2"
             >
                <Plus size={12} /> Alocar PET
             </button>
           )}
        </div>
      </div>
    </motion.div>
  );
};

export default BedCard;
