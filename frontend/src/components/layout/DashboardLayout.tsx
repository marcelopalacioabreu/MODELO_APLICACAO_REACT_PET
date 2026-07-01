'use client';

import React, { useState, useEffect } from 'react';
import DashboardSidebar, { MenuItem } from './DashboardSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu as MenuIcon, X, Bell, User as UserIcon, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarNavLinks: MenuItem[];
  isLoading?: boolean;
}

const DashboardLayout = ({ children, sidebarNavLinks, isLoading }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.mustChangePassword) {
      router.push('/auth/change-password');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-bg-light flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <DashboardSidebar navLinks={sidebarNavLinks} onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon size={20} />
            </button>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest hidden sm:block">
              Painel Administrativo
            </h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-slate-400 hover:text-primary-green transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{user?.roleName || user?.role || 'Acesso'}</p>
              </div>
              <div className="h-10 w-10 bg-primary-green/10 rounded-xl flex items-center justify-center text-primary-green">
                <UserIcon size={20} />
              </div>
              <button 
                onClick={() => logout()}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sair do Sistema"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-green mb-4"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                Sincronizando Dados...
              </p>
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
