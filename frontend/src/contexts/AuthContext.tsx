'use client';

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logoutUser } from '../services/apiService';
import { io } from 'socket.io-client';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: (reason?: string) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isInitializing = useRef(false);

  const normalizeUser = (userData: any) => {
    if (!userData) return null;
    
    // Elite normalization: Extrair roleName e permissions de forma robusta
    const roleObj = userData.role;
    const roleName = typeof roleObj === 'object' ? roleObj.name : (userData.roleName || roleObj);
    const permissions = userData.permissions || (typeof roleObj === 'object' ? roleObj.permissions : []);
    
    // Elite unit handling: Garantir que unitId seja extraído corretamente
    const unit = userData.unit?._id || userData.unit;

    return {
      ...userData,
      unit, // Injetando ID da unidade normalizado
      role: String(roleName).toUpperCase(),
      roleName: String(roleName).toUpperCase(),
      permissions: Array.isArray(permissions) ? permissions.map((p: any) => typeof p === 'string' ? p : p.key) : []
    };
  };

  const logout = useCallback(async (reason = 'Ação do usuário') => {
    console.log(`🛡️ [Auth] Logout acionado: ${reason}`);
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('token')) {
        await logoutUser();
      }
    } catch (err) {
      console.warn('🛡️ [Auth] Falha ao invalidar no servidor');
    }

    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Elite Logic: Só redirecionar se estiver em rota privada
      if (window.location.pathname.startsWith('/admin')) {
        router.push('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    if (token && user?.id) {
      const socket = io('/', {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        auth: { token }
      });
      return () => { socket.disconnect(); };
    }
  }, [token, user?.id]);

  const refreshUser = async () => {
    try {
      const { data } = await getMe();
      setUser(normalizeUser(data));
    } catch (error) {
      logout('Falha ao atualizar sessão');
    }
  };

  useEffect(() => {
    if (isInitializing.current) return;
    isInitializing.current = true;

    const initializeAuth = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (storedToken) {
        try {
          const res = await getMe();
          const normalized = normalizeUser(res.data);
          setUser(normalized);
          setToken(storedToken);

          // Elite Guard: Redirecionar na inicialização se necessário
          if (normalized.mustChangePassword && !window.location.pathname.includes('/auth/change-password')) {
            router.push('/auth/change-password');
          }
        } catch (error) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const normalized = normalizeUser(payload.user);
      setUser(normalized);

      if (normalized.mustChangePassword) {
        console.log('🛡️ [Auth] Senha provisória detectada. Redirecionando para /auth/change-password');
        router.push('/auth/change-password');
      } else {
        router.push('/admin');
      }
    } catch (e) {
      refreshUser().then(() => {
        // Após refreshUser, verificar se precisa trocar senha
        if (user?.mustChangePassword) {
          router.push('/auth/change-password');
        } else {
          router.push('/admin');
        }
      });
    }
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
    loading,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
