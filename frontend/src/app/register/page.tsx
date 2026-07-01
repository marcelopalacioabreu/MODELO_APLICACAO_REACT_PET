'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { publicRegisterTutor } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Phone, ShieldCheck, ChevronRight, Loader2, ArrowLeft, Heart, Activity, Dog } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LandingNavbar from '@/components/home/LandingNavbar';
import LandingFooter from '@/components/home/LandingFooter';

const RegisterPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', password: '', confirmPassword: '', phone: '',
    petName: '', species: 'CANINO'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }

    setLoading(true);
    try {
      const res = await publicRegisterTutor(formData);
      if (res.success) {
        login(res.token, res.refreshToken);
        toast.success("Cadastro realizado com sucesso!");
        router.push('/admin');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao realizar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-20 bg-slate-50/50 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
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
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Cadastro de Tutor</h1>
            <p className="text-slate-500 font-medium italic">Registre seus dados e de seus animais para acesso aos serviços municipais.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coluna 1: Dados Pessoais */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <User size={16} className="text-emerald-500" /> Seus Dados
                </h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome Completo</label>
                  <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="João Silva" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CPF</label>
                    <input name="cpf" required value={formData.cpf} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="000.000.000-00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">WhatsApp</label>
                    <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="(32) 9..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">E-mail</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="exemplo@email.com" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Senha</label>
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirmar</label>
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              {/* Coluna 2: Primeiro PET */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Dog size={16} className="text-blue-500" /> Seu Primeiro PET
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Animal</label>
                  <input name="petName" required value={formData.petName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-emerald-500/20 outline-none transition-all" placeholder="Rex, Mel, etc." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Espécie</label>
                  <select name="species" value={formData.species} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none">
                    <option value="CANINO">Cão (Canino)</option>
                    <option value="FELINO">Gato (Felino)</option>
                  </select>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 mt-6">
                  <p className="text-[10px] text-blue-600 font-bold leading-relaxed uppercase tracking-tight">
                    💡 <strong>Dica Elite:</strong> Você poderá cadastrar outros animais e anexar fotos assim que acessar seu painel de controle.
                  </p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Finalizar Meu Cadastro'}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="mt-12 flex justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-widest grayscale opacity-50">
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> PJF Digital</div>
            <div className="flex items-center gap-2"><Activity size={16} /> Suporte EMTEC</div>
            <div className="flex items-center gap-2"><Heart size={16} /> Bem-estar Animal</div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default RegisterPage;
