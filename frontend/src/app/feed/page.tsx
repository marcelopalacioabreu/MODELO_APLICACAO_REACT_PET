'use client';

import React, { useState, useEffect } from 'react';
import { getPublicFeed, likePost } from '@/services/apiService';
import { Heart, MessageCircle, Share2, MoreHorizontal, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from '@/components/home/LandingNavbar';
import LandingFooter from '@/components/home/LandingFooter';
import Link from 'next/link';

const PublicFeedPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const res = await getPublicFeed();
      setPosts(res.data);
    } catch (err) {
      console.error("Erro ao carregar Pet Stars", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
      setPosts(posts.map(p => p._id === postId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p));
    } catch (err) {
      // Silencioso se não estiver logado
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 max-w-2xl mx-auto w-full py-12 px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
           <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-emerald-600 transition-all">
             <ArrowLeft size={20} />
           </Link>
           <div className="text-center flex-1">
             <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Pet Stars</h1>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Timeline da Comunidade</p>
           </div>
           <div className="w-12" /> {/* Spacer */}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Sincronizando Estrelas...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence>
              {posts.map((post, idx) => (
                <motion.article 
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5">
                        <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center font-black text-emerald-600">
                          {post.pet?.name?.charAt(0) || 'P'}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-tight flex items-center gap-1">
                          {post.pet?.name || 'Pet Amigo'}
                          {post.isPromoted && <ShieldCheck size={14} className="text-blue-500" />}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">@{post.unit?.name || 'Comunidade PJF'}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Post Image */}
                  <div className="aspect-square bg-slate-100 relative group cursor-pointer overflow-hidden">
                    <img 
                      src={post.mediaUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80'} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Heart size={48} className="text-white fill-white animate-pulse" />
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 group">
                          <Heart size={24} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                          <span className="text-xs font-black text-slate-400 group-hover:text-slate-800">{post.likeCount || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 group">
                          <MessageCircle size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="text-xs font-black text-slate-400 group-hover:text-slate-800">0</span>
                        </button>
                        <button className="text-slate-400 hover:text-emerald-500 transition-colors">
                          <Share2 size={24} />
                        </button>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <span className="font-black uppercase text-[10px] tracking-tight mr-2">{post.pet?.name}</span>
                        {post.content}
                      </p>
                      <div className="flex gap-2">
                        {post.tags?.map((tag: string) => (
                          <span key={tag} className="text-[10px] font-black text-emerald-600 uppercase">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Time */}
                    <p className="mt-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Postado em {new Date(post.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
};

export default PublicFeedPage;
