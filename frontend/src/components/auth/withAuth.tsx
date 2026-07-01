'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string[] = []
) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }

      if (!loading && isAuthenticated && requiredPermissions.length > 0) {
        // Elite: Usar permissões normalizadas do contexto
        const userPermissions = user?.permissions || user?.role?.permissions || [];
        const roleName = String(user?.roleName || user?.role || '').toUpperCase();
        
        // ADMIN e SUPERADMIN ignoram checagem de permissão (Bypass de Elite)
        if (roleName !== 'ADMIN' && roleName !== 'SUPERADMIN') {
          const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
          if (!hasPermission) {
            console.warn('⚠️ [Security] Tentativa de acesso negado à página:', window.location.pathname);
            router.push('/admin'); // Redirecionar para dashboard em vez de tela de erro pesada
          }
        }
      }
    }, [isAuthenticated, loading, router, user, requiredPermissions]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
        </div>
      );
    }

    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}
