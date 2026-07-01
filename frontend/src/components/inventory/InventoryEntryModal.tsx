'use client';

import React, { useState } from 'react';
import { X, Save, Package, Hash, Calendar, Layers, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { addStockEntry } from '@/services/apiService';

interface InventoryEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  products: any[];
  locations: any[];
  currentUserUnit?: string;
}

const InventoryEntryModal = ({ isOpen, onClose, onSave, products, locations, currentUserUnit }: InventoryEntryModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    locationId: currentUserUnit || '',
    batchNumber: '',
    quantity: '',
    expiryDay: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addStockEntry({
        ...formData,
        quantity: Number(formData.quantity)
      });
      toast.success("Lote registrado com sucesso na prateleira!");
      onSave();
      onClose();
    } catch (err) {
      toast.error("Erro ao registrar entrada de mercadoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Entrada de Lote</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abastecimento Industrial</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Produto / Insumo</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-green outline-none appearance-none transition-all"
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                  >
                    <option value="">Selecione o Insumo</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.unitOfMeasure})</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nº do Lote</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="text" placeholder="Lote" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-primary-green transition-all" 
                      value={formData.batchNumber} onChange={e => setFormData({...formData, batchNumber: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quantidade</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="number" placeholder="Qtd" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-primary-green transition-all" 
                      value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Data de Validade</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-primary-green transition-all" 
                    value={formData.expiryDay} onChange={e => setFormData({...formData, expiryDay: e.target.value})} />
                </div>
              </div>

              <button disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-green transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl">
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 Confirmar Entrada
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InventoryEntryModal;
