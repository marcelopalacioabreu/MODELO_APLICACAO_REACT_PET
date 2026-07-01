import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-light p-4 text-center">
      <h2 className="text-4xl font-black text-primary-green mb-4">404</h2>
      <p className="text-slate-600 mb-8">Página não encontrada no ecossistema Aplicação Modelo.</p>
      <Link 
        href="/" 
        className="bg-primary-green text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-teal transition-all"
      >
        Voltar ao Início
      </Link>
    </div>
  );
}
