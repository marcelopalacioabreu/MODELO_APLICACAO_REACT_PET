'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNote } from '@/services/apiService';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createNote({ title, body });
      router.push('/admin/notes');
    } catch (err) {
      alert('Erro ao criar');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Criar Nota</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Conteúdo</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} className="w-full border p-2 rounded h-40" />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving? 'Salvando...':'Salvar'}</button>
        </div>
      </form>
    </div>
  );
}
