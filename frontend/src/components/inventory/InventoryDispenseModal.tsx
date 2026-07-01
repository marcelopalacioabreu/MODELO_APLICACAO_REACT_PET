'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Package, 
  Dog, 
  Search, 
  MinusCircle, 
  AlertTriangle,
  History,
  CheckCircle2,
  Loader2,
  Stethoscope,
  Info
} from 'lucide-react';
import { getPets, dispenseStock } from '@/services/apiService';
import { toast } from 'react-toastify';

interface InventoryDispenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: any;
  onSuccess: () => void;
}

const InventoryDispenseModal = ({ isOpen, onClose, batch, onSuccess }: InventoryDispenseModalProps) => {
  const [loading, setLoading] = useState(false);
  const [petSearch, setPetSearch] = useState('');
  const [allPets, setAllPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'CLINICAL' | 'OPERATIONAL'>('CLINICAL');

  useEffect(() => {
    if (isOpen) {
       fetchPets();
       setQuantity(1);
       setReason('');
       setSelectedPet(null);
    }
  }, [isOpen]);

  const fetchPets = async () => {
    try {
      const res = await getPets();
      if (res.success) setAllPets(res.data);
    } catch (err) {
      console.error("Erro ao carregar pets para dispensação.");
    }
  };

  const handleDispense = async () => {
    if (quantity <= 0 || quantity > batch.quantity) {
      toast.error("Quantidade inválida para o saldo atual.");
      return;
    }

    setLoading(true);
    try {
      const res = await dispenseStock({
        batchId: batch._id,
        quantity,
        petId: selectedPet?._id,
        reason,
        type
      });

      if (res.success) {
        toast.success("Dispensação realizada e registrada no histórico!");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao realizar dispensação.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = allPets.filter(p => 
    p.name.toLowerCase().includes(petSearch.toLowerCase()) ||
    p._id.slice(-4).includes(petSearch.toLowerCase())
  ).slice(0, 5);

  if (!isOpen || !batch) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-100 flex flex-col"
      >
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                 <MinusCircle size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-tighter">Dispensar Insumo</h2>
                 <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Saída de Estoque</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
           {/* Info do Lote */}
           <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400"><Package size={20} /></div>
                 <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{batch.product?.name}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lote: {batch.batchNumber} • Saldo: {batch.quantity} {batch.product?.unitOfMeasure}</p>
                 </div>
              </div>
           </div>

           {/* Seleção de Destino */}
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destinatário (Opcional)</label>
              <div className="relative">
                 <input 
                   type="text" value={petSearch} onChange={e => setPetSearch(e.target.value)}
                   placeholder="Pesquisar animal por nome..."
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-primary-green outline-none transition-all"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>

              {petSearch && !selectedPet && (
                <div className="bg-white border-2 border-slate-50 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
                   {filteredPets.length === 0 ? (
                      <div className="p-4 text-center text-[10px] font-black text-slate-400 uppercase">Nenhum animal localizado.</div>
                   ) : (
                      filteredPets.map(pet => (
                        <div 
                          key={pet._id} onClick={() => { setSelectedPet(pet); setPetSearch(pet.name); }}
                          className="p-4 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 flex items-center justify-between group"
                        >
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-primary-green text-[10px] font-black">{pet.name.charAt(0)}</div>
                              <div>
                                 <p className="text-xs font-black text-slate-800 uppercase">{pet.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">{pet.breed}</p>
                              </div>
                           </div>
                           <CheckCircle2 size={16} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      ))
                   )}
                </div>
              )}

              {selectedPet && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Dog size={20} className="text-primary-green" /></div>
                      <div>
                         <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">Vincular a: {selectedPet.name}</p>
                         <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest italic">Ação será registrada no prontuário</p>
                      </div>
                   </div>
                   <button onClick={() => { setSelectedPet(null); setPetSearch(''); }} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-400"><X size={16} /></button>
                </div>
              )}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantidade</label>
                 <input 
                   type="number" min="1" max={batch.quantity} value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                   className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black focus:border-rose-500 outline-none transition-all"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                 <select 
                   value={type} onChange={e => setType(e.target.value as any)}
                   className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black focus:border-primary-green outline-none appearance-none"
                 >
                    <option value="CLINICAL">USO CLÍNICO</option>
                    <option value="OPERATIONAL">USO INTERNO / PERDA</option>
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo / Observações</label>
              <textarea 
                value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Ex: Dose administrada conforme prontuário, item danificado..."
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xs font-medium focus:border-primary-green outline-none min-h-[100px] transition-all resize-none"
              />
           </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
           <button onClick={onClose} className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
           <button 
             onClick={handleDispense} disabled={loading}
             className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
           >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              Confirmar Dispensação
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryDispenseModal;
