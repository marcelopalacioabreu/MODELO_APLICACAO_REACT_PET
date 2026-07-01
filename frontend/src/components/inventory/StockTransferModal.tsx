'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Building2, 
  Layers, 
  MessageSquare, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { transferStock, getMyNetwork } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  batch: any;
}

const StockTransferModal = ({ isOpen, onClose, onSave, batch }: StockTransferModalProps) => {
  const auth = useAuth(); // Elite Defense: Usar o objeto completo
  const [loading, setLoading] = useState(false);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [networkLocations, setNetworkLocations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    targetLocationId: '',
    quantity: '',
    reason: ''
  });

  // Escopo Isolado para evitar ReferenceError
  useEffect(() => {
    if (!isOpen || !auth?.user) return;

    const fetchNetwork = async () => {
      const currentUnitId = auth.user.unit?._id || auth.user.unit;
      if (!currentUnitId) return;

      setNetworkLoading(true);
      try {
        const res = await getMyNetwork();
        if (res.success) {
          // Filtrar a própria unidade
          const filtered = res.data.filter((l: any) => l._id !== currentUnitId);
          setNetworkLocations(filtered);
        }
      } catch (err) {
        console.error("Erro rede:", err);
        toast.error("Erro ao carregar círculo de confiança.");
      } finally {
        setNetworkLoading(false);
      }
    };

    fetchNetwork();
  }, [isOpen, auth?.user]); // Dependência no objeto auth.user

  if (!batch) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(formData.quantity) > batch.quantity) {
      toast.error("Quantidade superior ao saldo disponível.");
      return;
    }

    setLoading(true);
    try {
      await transferStock({
        batchId: batch._id,
        targetLocationId: formData.targetLocationId,
        quantity: Number(formData.quantity),
        reason: formData.reason
      });
      toast.success("Movimentação concluída!");
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Falha na transferência.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-0" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden relative z-10 my-auto border border-white/20"
          >
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Transferência</h2>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                  <ShieldCheck size={12} /> Círculo de Confiança Logístico
                </p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">Item em Trânsito</p>
                 <p className="text-lg font-black uppercase tracking-tight">{batch.product.name}</p>
                 <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                    <div className="flex-1">
                       <p className="text-[9px] font-bold text-slate-400 uppercase">Lote</p>
                       <p className="text-xs font-black text-emerald-200">{batch.batchNumber}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-bold text-slate-400 uppercase">Saldo</p>
                       <p className="text-xs font-black text-white">{batch.quantity} {batch.product.unitOfMeasure}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Rede Vinculada (Destino)</label>
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <select 
                    required
                    disabled={networkLoading}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-600/20 outline-none appearance-none"
                    value={formData.targetLocationId}
                    onChange={(e) => setFormData({...formData, targetLocationId: e.target.value})}
                  >
                    <option value="">{networkLoading ? 'Sincronizando Rede...' : 'Selecione a Unidade'}</option>
                    {networkLocations.map(l => (
                      <option key={l._id} value={l._id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Quantidade</label>
                <input required type="number" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none" 
                  value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Motivo</label>
                <textarea required rows={2} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none resize-none" 
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              </div>

              <button disabled={loading || networkLocations.length === 0} className="w-full flex justify-between items-center bg-slate-900 hover:bg-emerald-600 text-white font-black py-6 px-10 rounded-[2rem] transition-all active:scale-95 disabled:opacity-50 shadow-xl">
                 <span className="text-xs uppercase tracking-[0.3em]">{loading ? 'Processando...' : 'Confirmar'}</span>
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRightLeft size={20} />}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StockTransferModal;
