'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNotes } from '@/services/apiService';

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getNotes().then(res => { if (mounted && res?.data) setNotes(res.data); }).catch(()=>{}).finally(()=>setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notes (Exemplo)</h1>
        <Link href="/admin/notes/create" className="px-4 py-2 bg-blue-600 text-white rounded">Criar Nota</Link>
      </div>
      {loading && <div>Carregando...</div>}
      {!loading && notes.length === 0 && <div>Nenhuma nota encontrada.</div>}
      <div className="grid gap-4">
        {notes.map(n => (
          <div key={n._id} className="p-4 border rounded">
            <h3 className="font-bold">{n.title}</h3>
            <p className="text-sm text-slate-600">{n.body?.slice(0,200)}</p>
            <div className="mt-2">
              <Link href={`/admin/notes/${n._id}`} className="text-blue-600">Abrir / Editar</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
