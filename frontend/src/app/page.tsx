'use client';

import React from 'react';
import LandingNavbar from '@/components/home/LandingNavbar';
import LandingHero from '@/components/home/LandingHero';
import LostPetBanner from '@/components/home/LostPetBanner';
import TransparencyStats from '@/components/home/TransparencyStats';
import EngagementCards from '@/components/home/EngagementCards';
import PetStarsFeed from '@/components/home/PetStarsFeed';
import LostPetsSection from '@/components/home/LostPetsSection';
import AdoptionSection from '@/components/home/AdoptionSection';
import AdoptionStatusTracker from '@/components/home/AdoptionStatusTracker';
import LandingFooter from '@/components/home/LandingFooter';
import { motion, useScroll, useSpring } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { getHomeConfig } from '@/services/apiService';
import { parseEliteText } from '@/utils/textParser';

const HomePage = () => {
  const [config, setConfig] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const fetchConfig = async () => {
    try {
      const res = await getHomeConfig();
      if (res.success) setConfig(res.data);
    } catch (err) {
      console.error("Falha ao sincronizar portal.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchConfig(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
       <RefreshCw className="text-emerald-500 animate-spin" size={48} />
    </div>
  );

  const isVisible = (id: string) => {
    return config?.sections?.find((s: any) => s.id === id)?.isVisible !== false;
  };

  const getSection = (id: string) => {
    return config?.sections?.find((s: any) => s.id === id);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-600 selection:text-white">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-emerald-600 z-[60] origin-left" style={{ scaleX }} />

      {isVisible('banner') && (
        <div className="fixed top-0 left-0 w-full z-[55]">
          <LostPetBanner />
        </div>
      )}

      {isVisible('navbar') && <LandingNavbar />}

      <main>
        {/* Impacto Inicial Dinâmico */}
        {isVisible('hero') && (
          <LandingHero 
            title={getSection('hero')?.title} 
            subtitle={getSection('hero')?.subtitle} 
          />
        )}

        {/* Timeline Dinâmica */}
        {isVisible('feed') && (
          <PetStarsFeed 
            title={getSection('feed')?.title} 
            subtitle={getSection('feed')?.subtitle} 
          />
        )}

        {/* Alertas Dinâmicos */}
        {isVisible('lost_pets') && (
          <LostPetsSection 
            title={getSection('lost_pets')?.title} 
            subtitle={getSection('lost_pets')?.subtitle} 
          />
        )}

        {/* Benefícios Dinâmicos */}
        {isVisible('benefits') && (
          <EngagementCards 
            title={getSection('benefits')?.title} 
            subtitle={getSection('benefits')?.subtitle} 
          />
        )}

        {/* Estatísticas Dinâmicas */}
        {isVisible('stats') && (
          <TransparencyStats 
            title={getSection('stats')?.title} 
            subtitle={getSection('stats')?.subtitle} 
          />
        )}

        {/* Vitrine de Adoção Dinâmica */}
        {isVisible('adoption') && (
          <>
            <AdoptionSection 
              title={getSection('adoption')?.title} 
              subtitle={getSection('adoption')?.subtitle} 
            />
            <AdoptionStatusTracker />
          </>
        )}

        {/* Institucional Dinâmico */}
        {isVisible('institutional') && (
          <section className="py-24 bg-emerald-600 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="container mx-auto px-6 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">
                {parseEliteText(getSection('institutional')?.title || "Juiz de Fora: Referência em Bem-Estar Animal")}
              </h2>
              <p className="text-emerald-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
                {parseEliteText(getSection('institutional')?.subtitle || "Junte-se a milhares de tutores e unidades de saúde que já utilizam a plataforma.")}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">
                  8.000+ Pets Vacinados
                </div>
                <div className="px-8 py-4 bg-emerald-700/50 backdrop-blur-md text-white border border-emerald-400 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl">
                  100% Transparência
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {config && <LandingFooter config={config.footer} />}
    </div>
  );
};

export default HomePage;
