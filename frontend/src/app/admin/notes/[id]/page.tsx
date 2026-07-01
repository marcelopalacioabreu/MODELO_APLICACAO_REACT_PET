'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getNote, updateNote, deleteNote } from '@/services/apiService';

export default function EditNote() {
  const params:any = useParams();
  const id = params.id;
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    let mounted = true;
    getNote(id).then(res=>{ if (mounted) setNote(res.data); }).catch(()=>{}).finally(()=>setLoading(false));
    return ()=>{ mounted=false };
  },[id]);

  const save = async ()=>{
    setSaving(true);
    try { await updateNote(id, { title: note.title, body: note.body }); router.push('/admin/notes'); }
    catch(e){ alert('Erro'); } finally { setSaving(false); }
  };

  const remove = async ()=>{
    if (!confirm('Excluir nota?')) return;
    try { await deleteNote(id); router.push('/admin/notes'); } catch(e){ alert('Erro'); }
  };

  if (loading) return <div className="p-6">Carregando...</div>;
  if (!note) return <div className="p-6">Nota não encontrada</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Nota</h1>
      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input value={note.title} onChange={e=>setNote({...note, title: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Conteúdo</label>
          <textarea value={note.body} onChange={e=>setNote({...note, body: e.target.value})} className="w-full border p-2 rounded h-40" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded" disabled={saving}>{saving? 'Salvando...':'Salvar'}</button>
          <button onClick={remove} className="px-4 py-2 bg-red-600 text-white rounded">Excluir</button>
        </div>
      </div>
    </div>
  );
}
