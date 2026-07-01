'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, User, CreditCard, Mail, Phone, MapPin, MessageSquare, ShieldCheck, Loader2, CheckCircle, RefreshCw, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getFileURL } from '@/services/apiService';

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: any;
}

const AdoptionModal = ({ isOpen, onClose, pet }: AdoptionModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingCPF, setCheckingCPF] = useState(false);
  const [checkingCEP, setCheckingCEP] = useState(false);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);

  const [captchaChallenge, setCaptchaChallenge] = useState({ a: 0, b: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    message: ''
  });

  const generateCaptcha = () => {
    setCaptchaChallenge({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
    setCaptchaAnswer('');
  };

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      generateCaptcha();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!pet || !mounted) return null;

  const handleCPFBlur = async () => {
    const cleanCPF = formData.cpf.replace(/\D/g, '');
    if (cleanCPF.length < 11) return;
    
    setCheckingCPF(true);
    try {
      const { data } = await axios.get(`/api/adoptions/check-cpf/${cleanCPF}`);
      if (data.exists) {
        setUserExists(true);
        toast.info(`Identificamos seu cadastro!`);
      } else {
        setUserExists(false);
      }
    } catch (err) {
      console.error("Erro ao verificar CPF");
    } finally {
      setCheckingCPF(false);
    }
  };

  const handleCEPBlur = async () => {
    const cep = formData.zipCode.replace(/\D/g, '');
    if (cep.length !== 8) return;
    
    setCheckingCEP(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
        toast.success("Endereço localizado!");
      }
    } catch (err) {
      toast.error("Falha ao consultar CEP.");
    } finally {
      setCheckingCEP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== (captchaChallenge.a + captchaChallenge.b)) {
      toast.error("Desafio de segurança incorreto.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const payload = {
        petId: pet._id,
        name: formData.name,
        cpf: formData.cpf.replace(/\D/g, ''),
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        address: {
          zipCode: formData.zipCode,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state
        }
      };

      const { data } = await axios.post('/api/adoptions', payload);
      setSubmittedProtocol(data.data.protocol);
      toast.success("Manifestação registrada!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh]">
            {submittedProtocol ? (
              <div className="flex-1 p-20 text-center flex flex-col items-center justify-center space-y-8">
                 <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><CheckCircle size={48} /></div>
                 <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Manifestação Registrada</h2>
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 w-full max-w-md">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Número do Protocolo</p>
                    <p className="text-3xl font-black text-emerald-600 tracking-wider">{submittedProtocol}</p>
                 </div>
                 <button onClick={onClose} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Entendido</button>
              </div>
            ) : (
              <>
                <div className="md:w-2/5 bg-slate-50 p-10 flex flex-col items-center justify-center text-center border-r border-slate-100 shrink-0">
                    <div className="w-48 h-48 rounded-[3rem] overflow-hidden shadow-2xl mb-8 ring-[12px] ring-white relative z-10 bg-slate-200">
                      <img src={getFileURL(pet.photos?.[0]) || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'} className="w-full h-full object-cover" alt={pet.name} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{pet.name}</h3>
                    <p className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">{pet.breed}</p>
                </div>

                <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Manifestação</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Protocolo de Interesse Público</p>
                      </div>
                      <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                       {/* Alerta de Cadastro Identificado (Elite Visibility) */}
                       <AnimatePresence>
                         {userExists && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                             <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center gap-4 shadow-xl border border-emerald-500 mb-6">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                   <ShieldCheck size={24} />
                                </div>
                                <div>
                                   <p className="text-[11px] font-black uppercase tracking-widest mb-1">Registro Identificado</p>
                                   <p className="text-[10px] font-bold opacity-90 leading-tight">
                                     Seu CPF já possui cadastro oficial na rede municipal. Esta solicitação será vinculada ao seu registro de elite.
                                   </p>
                                </div>
                             </div>
                           </motion.div>
                         )}
                       </AnimatePresence>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Seu CPF</label>
                             <div className="relative">
                               <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                               <input required type="text" placeholder="000.000.000-00" className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none" 
                                 value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} onBlur={handleCPFBlur} />
                               {checkingCPF && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin" size={18} />}
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nome Completo</label>
                             <input required type="text" placeholder="Seu nome" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-emerald-500" 
                               value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input required type="email" placeholder="E-mail" className="w-full pl-14 pr-4 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input required type="text" placeholder="WhatsApp" className="w-full pl-14 pr-4 py-5 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] border-b pb-2">Residência</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <input required type="text" placeholder="CEP" className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" 
                               value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} onBlur={handleCEPBlur} />
                             <input required type="text" placeholder="Rua" className="col-span-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" 
                               value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <input required type="text" placeholder="Nº" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" 
                               value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                             <input type="text" placeholder="Comp." className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" 
                               value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} />
                             <input required type="text" placeholder="Bairro" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" 
                               value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
                          </div>
                       </div>

                       <textarea rows={2} placeholder="Sua mensagem..." className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-emerald-500 resize-none" 
                         value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />

                       <div className="p-6 bg-slate-900 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                             <div className="flex items-center gap-4 text-emerald-400">
                                <Lock size={20} />
                                <div><p className="text-[10px] font-black uppercase tracking-widest">Anti-Bot</p><p className="text-white text-sm font-bold">{captchaChallenge.a} + {captchaChallenge.b} = ?</p></div>
                             </div>
                             <input required type="number" className="w-24 px-4 py-4 bg-white/10 border-2 border-white/10 rounded-2xl text-white text-center font-black outline-none focus:border-emerald-500"
                               value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} />
                          </div>
                       </div>

                       <button disabled={loading} className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50">
                          {loading ? <Loader2 className="animate-spin" size={24} /> : "Finalizar Manifestação"}
                       </button>
                    </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const target = document.getElementById('modal-portal');
  return target ? createPortal(modalContent, target) : null;
};

export default AdoptionModal;
