'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Package, Dog, Search, MinusCircle, CheckCircle2, Loader2, Info, Trash2
} from 'lucide-react';
import { getPets, bulkDispenseStock } from '@/services/apiService';
import { toast } from 'react-toastify';

interface InventoryBulkDispenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: any[];
  onRemoveItem: (batchId: string) => void;
  onSuccess: () => void;
}

const InventoryBulkDispenseModal = ({ isOpen, onClose, selectedItems, onRemoveItem, onSuccess }: InventoryBulkDispenseModalProps) => {
  const [loading, setLoading] = useState(false);
  const [petSearch, setPetSearch] = useState('');
  const [allPets, setAllPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
       fetchPets();
       const initialQtys: Record<string, number> = {};
       selectedItems.forEach(item => { initialQtys[item.batchId] = 1; });
       setQuantities(initialQtys);
    }
  }, [isOpen, selectedItems]);

  const fetchPets = async () => {
    try {
      const res = await getPets();
      if (res.success) setAllPets(res.data);
    } catch (err) { console.error("Erro ao carregar pets."); }
  };

  const handleUpdateQty = (batchId: string, val: number, max: number) => {
    const newQty = Math.max(1, Math.min(val, max));
    setQuantities(prev => ({ ...prev, [batchId]: newQty }));
  };

  const handleBulkDispense = async () => {
    if (selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      const items = selectedItems.map(item => ({
        batchId: item.batchId,
        quantity: quantities[item.batchId] || 1
      }));

      const res = await bulkDispenseStock({
        items,
        petId: selectedPet?._id,
        reason,
        type: selectedPet ? 'CLINICAL' : 'OPERATIONAL'
      });

      if (res.success) {
        toast.success(res.message);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro na dispensação coletiva.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = allPets.filter(p => 
    p.name.toLowerCase().includes(petSearch.toLowerCase())
  ).slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-slate-100 flex flex-col max-h-[90vh]"
      >
        <div className="p-8 bg-primary-green text-white flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                 <Package size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-tighter">Dispensação Coletiva</h2>
                 <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">{selectedItems.length} itens selecionados</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={24} /></button>
        </div>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
           {/* Seleção de PET Único para todos os itens */}
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destinatário Comum (Animal ou Uso Interno)</label>
              <div className="relative">
                 <input 
                   type="text" value={petSearch} onChange={e => setPetSearch(e.target.value)}
                   placeholder="Vincular todos a um animal..."
                   className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-primary-green outline-none transition-all"
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>

              {petSearch && !selectedPet && (
                <div className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-xl">
                   {filteredPets.map(pet => (
                      <div key={pet._id} onClick={() => { setSelectedPet(pet); setPetSearch(pet.name); }} className="p-4 hover:bg-emerald-50 cursor-pointer flex items-center justify-between group border-b border-slate-50 last:border-0">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-primary-green text-[10px] font-black">{pet.name.charAt(0)}</div>
                            <p className="text-xs font-black text-slate-800 uppercase">{pet.name}</p>
                         </div>
                         <CheckCircle2 size={16} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                   ))}
                </div>
              )}

              {selectedPet && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-green"><Dog size={20} /></div>
                      <div>
                         <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">Aplicar em: {selectedPet.name}</p>
                         <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">O uso de cada item será registrado no prontuário.</p>
                      </div>
                   </div>
                   <button onClick={() => { setSelectedPet(null); setPetSearch(''); }} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-400"><X size={16} /></button>
                </div>
              )}
           </div>

           {/* Lista de Itens do Carrinho */}
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Itens do Lote</label>
              {selectedItems.map((item) => (
                <div key={item.batchId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-6">
                   <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm"><Package size={18} /></div>
                      <div>
                         <p className="text-xs font-black text-slate-800 uppercase truncate w-40">{item.productName}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Lote: {item.batchNumber} • Saldo: {item.maxQty}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <input 
                        type="number" min="1" max={item.maxQty} 
                        value={quantities[item.batchId] || 1} 
                        onChange={(e) => handleUpdateQty(item.batchId, Number(e.target.value), item.maxQty)}
                        className="w-20 p-2 bg-white border-2 border-slate-100 rounded-xl text-center text-xs font-black focus:border-primary-green outline-none"
                      />
                      <button onClick={() => onRemoveItem(item.batchId)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Motivo / Observações Gerais</label>
              <textarea 
                value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Ex: Administração coletiva de protocolo sanitário..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xs font-medium focus:border-primary-green outline-none min-h-[80px] transition-all resize-none"
              />
           </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
           <button onClick={onClose} className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
           <button 
             onClick={handleBulkDispense} disabled={loading || selectedItems.length === 0}
             className="flex-[2] py-4 bg-primary-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-primary-green/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
           >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              Confirmar Saída Coletiva
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryBulkDispenseModal;
