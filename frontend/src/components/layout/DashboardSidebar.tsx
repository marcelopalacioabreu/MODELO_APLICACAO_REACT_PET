'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, X, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export interface MenuItem {
  label: string;
  icon?: string | React.ReactNode;
  path: string;
  permission?: string;
  badge?: number;
  isHeader?: boolean;
  children?: MenuItem[];
}

interface DashboardSidebarProps {
  navLinks: MenuItem[];
  onClose: () => void;
}

const DashboardSidebar = ({ navLinks = [], onClose }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const renderIcon = (iconName: any) => {
    if (!iconName) return null;
    if (typeof iconName !== 'string') return iconName;
    
    // @ts-ignore
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={18} /> : null;
  };

  const NavItem = ({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
    // Elite Strategy: Filtragem de Permissões
    const isAdmin = user?.role === 'ADMIN' || user?.roleName === 'ADMIN';
    const userPermissions = user?.permissions || [];
    
    // Se o item tem permissão e o usuário não é admin e não tem a chave, oculta
    if (item.permission && !isAdmin && !userPermissions.includes(item.permission)) {
      return null;
    }

    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
    const hasChildren = item.children && item.children.length > 0;

    if (item.isHeader) {
      return (
        <li className="mt-6 mb-2">
          <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {item.label}
          </span>
        </li>
      );
    }

    return (
      <li>
        <Link
          href={item.path}
          onClick={() => !hasChildren && onClose()}
          className={`
            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
            ${isActive 
              ? 'bg-primary-green text-white shadow-lg shadow-primary-green/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary-green'}
          `}
        >
          <div className="flex items-center gap-3">
            <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-green transition-colors'}>
              {renderIcon(item.icon)}
            </span>
            <span className="text-sm font-bold tracking-tight">{item.label}</span>
          </div>
          
          {item.badge !== undefined && item.badge > 0 && (
            <span className={`
              px-2 py-0.5 rounded-full text-[10px] font-black
              ${isActive ? 'bg-white text-primary-green' : 'bg-primary-green text-white'}
            `}>
              {item.badge}
            </span>
          )}

          {hasChildren && <ChevronRight size={14} className={isActive ? 'text-white/50' : 'text-slate-300'} />}
        </Link>

        {hasChildren && isActive && (
          <ul className="mt-1 ml-4 space-y-1 border-l-2 border-slate-100 pl-2 animate-fadeIn">
            {item.children?.map((child, idx) => (
              <NavItem key={idx} item={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <span className="font-black text-slate-800 text-lg tracking-tighter">Aplicação Modelo</span>
        </Link>
        <button className="lg:hidden p-2 text-slate-400" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <ul className="space-y-1">
          {navLinks?.map((link, idx) => (
            <NavItem key={idx} item={link} />
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Sistema</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700">Online & Sincronizado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
