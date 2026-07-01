'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Award, Share2, ArrowRight } from 'lucide-react';
import { getPublicFeed } from '@/services/apiService';
import { parseEliteText } from '@/utils/textParser';
import Link from 'next/link';

interface PetStarsFeedProps {
  title?: string;
  subtitle?: string;
}

const PetStarsFeed = ({ title, subtitle }: PetStarsFeedProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getPublicFeed();
        setPosts(res.data || []);
      } catch (err) {
        console.error('Falha ao carregar PET Stars');
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const mockPosts = [
    {
      _id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
      user: { name: 'Flávio' },
      pet: { name: 'Rex', breed: 'Golden Retriever' },
      content: 'Rex tomou sua vacina hoje e ganhou 50 pontos de XP!',
      likeCount: 124,
      isPromoted: true
    },
    {
      _id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      user: { name: 'Ana Silva' },
      pet: { name: 'Mimi', breed: 'SRD' },
      content: 'Mimi está completando 2 anos na Aplicação Modelo!',
      likeCount: 89,
      isPromoted: false
    },
    {
      _id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
      user: { name: 'Carlos' },
      pet: { name: 'Bob', breed: 'Bulldog' },
      content: 'Bob está radiante com seu novo microchip municipal!',
      likeCount: 215,
      isPromoted: true
    }
  ];

  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : mockPosts;

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            {/* Elite Dynamic Header */}
            {!title ? (
               <>
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <Award size={14} /> Comunidade Pet Stars
                </h3>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                  Acompanhe a <br /> <span className="text-blue-600">Nossa Timeline</span>
                </h2>
               </>
            ) : (
               <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                  {parseEliteText(title)}
               </h2>
            )}
            
            <p className="mt-6 text-slate-500 font-medium italic">
              {parseEliteText(subtitle || "Quanto mais você cuida do seu pet, mais famoso ele fica.")}
            </p>
          </div>
          <Link href="/feed" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3">
            Ver Feed Completo <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 group shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={post.imageUrl || post.mediaUrl} alt={post.pet?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {(post.isPromoted || index % 2 === 0) && (
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-lg">
                    <Star size={12} fill="currentColor" /> PET Star
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{post.pet?.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.pet?.breed || 'SRD'} • {post.user?.name || post.unit?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-rose-500 font-black text-sm">
                    <Heart size={20} fill={index === 0 ? "currentColor" : "none"} />
                    {post.likeCount}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{post.content}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetStarsFeed;
