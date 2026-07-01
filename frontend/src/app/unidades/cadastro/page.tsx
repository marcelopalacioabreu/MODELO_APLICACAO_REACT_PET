'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicRegisterUnit } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { Building, User, Mail, Lock, Phone, MapPin, ShieldCheck, ChevronRight, Loader2, Heart, Activity, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LandingNavbar from '@/components/home/LandingNavbar';
import LandingFooter from '@/components/home/LandingFooter';

const UnitRegistrationPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Unidade, 2: Administrador

  const [formData, setFormData] = useState({
    unitName: '', unitType: 'CLINICA', cnpj: '',
    street: '', number: '', neighborhood: '', city: 'Juiz de Fora', state: 'MG',
    adminName: '', email: '', cpf: '', password: '', confirmPassword: '', phone: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      const res = await publicRegisterUnit(formData);
      if (res.success) {
        toast.success("Credenciamento solicitado com sucesso!");
        if (res.token) {
           login(res.token, res.refreshToken);
           router.push('/admin');
        } else {
           setIsSuccess(true);
           window.scrollTo(0, 0);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <LandingNavbar />
        <main className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-emerald-100"
          >
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Solicitação Enviada!</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              Seus dados e os da unidade <strong>{formData.unitName}</strong> foram registrados com sucesso. <br />
              Agora, nossa equipe municipal realizará a homologação técnica. Você receberá uma notificação no e-mail <strong>{formData.email}</strong> assim que o acesso for liberado.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
              Voltar para a Home
            </Link>
          </motion.div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-20 bg-slate-50/50 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors mb-12 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para a Página Inicial
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Credenciamento de Unidade</h1>
            <p className="text-slate-500 font-medium italic">Integre sua Clínica ou ONG à rede municipal de proteção.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            {/* Progress Stepper */}
            <div className="flex border-b border-slate-50">
              <div className={`flex-1 p-6 text-center border-r border-slate-50 transition-colors ${step === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-400'}`}>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Passo 01</p>
                 <h4 className="text-sm font-black uppercase flex items-center justify-center gap-2">
                   <Building size={16} /> Dados da Unidade
                 </h4>
              </div>
              <div className={`flex-1 p-6 text-center transition-colors ${step === 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-400'}`}>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Passo 02</p>
                 <h4 className="text-sm font-black uppercase flex items-center justify-center gap-2">
                   <User size={16} /> Administrador
                 </h4>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {step === 1 ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome da Unidade (Razão Social/Nome Fantasia)</label>
                      <div className="relative group">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="unitName" required value={formData.unitName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="Ex: Clínica Veterinária Amigo PET" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tipo de Unidade</label>
                      <select name="unitType" value={formData.unitType} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none">
                        <option value="CLINICA">Clínica Veterinária</option>
                        <option value="ONG">ONG / Proteção Animal</option>
                        <option value="HOSPITAL">Hospital Veterinário</option>
                        <option value="CANIL">Canil / Abrigo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Logradouro (Rua/Av)</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="street" required value={formData.street} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="Rua das Flores" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Número</label>
                      <input name="number" required value={formData.number} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="123" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Bairro</label>
                      <input name="neighborhood" required value={formData.neighborhood} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="Centro" />
                    </div>
                    <div className="space-y-2 text-slate-400 opacity-60">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-2">Cidade</label>
                      <input readOnly value="Juiz de Fora" className="w-full px-6 py-4 bg-slate-100 border-transparent rounded-2xl text-sm font-bold cursor-not-allowed" />
                    </div>
                    <div className="space-y-2 text-slate-400 opacity-60">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-2">Estado</label>
                      <input readOnly value="MG" className="w-full px-6 py-4 bg-slate-100 border-transparent rounded-2xl text-sm font-bold cursor-not-allowed" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Responsável</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="adminName" required value={formData.adminName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="Seu nome completo" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-mail Corporativo</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="contato@clinica.com" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CPF do Responsável</label>
                      <input name="cpf" required value={formData.cpf} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Telefone / WhatsApp</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="(32) 99999-0000" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Senha de Acesso</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirmar Senha</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-12 flex flex-col md:flex-row items-center gap-4">
                {step === 2 && (
                  <button type="button" onClick={() => setStep(1)} className="w-full md:w-auto px-10 py-5 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600 transition-colors">
                    Voltar
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex-1 flex items-center justify-between px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? 'Processando Credenciais...' : step === 1 ? 'Próximo Passo' : 'Solicitar Acesso'}</span>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-12 flex justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-widest grayscale opacity-50">
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> Sistema Integrado PJF</div>
            <div className="flex items-center gap-2"><Activity size={16} /> Suporte Técnico EMTEC</div>
            <div className="flex items-center gap-2"><Heart size={16} /> Bem-estar Animal</div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default UnitRegistrationPage;
