'use client';

import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/auth/withAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { MenuItem } from '../../components/layout/DashboardSidebar';
import { useState, useEffect } from 'react';
import { getMenuData } from '../../services/apiService';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!user) return;
      
      try {
        const menuName = user.role === 'TUTOR' ? 'SIDEBAR_TUTOR' : 'SIDEBAR_ADMIN';
        const response = await getMenuData(menuName);
        
        if (response.success && response.data) {
          // O menuController já retorna o array de itens filtrados em response.data
          setMenuItems(response.data);
        } else {
          setMenuItems([{ label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin', order: 1 }]);
        }
      } catch (error) {
        console.error("Erro ao carregar menu dinâmico:", error);
        setMenuItems([{ label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin', order: 1 }]);
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchMenu();
  }, [user]);

  return (
    <DashboardLayout sidebarNavLinks={menuItems} isLoading={loading || isMenuLoading}>
      {children}
    </DashboardLayout>
  );
};

export default withAuth(AdminLayout);
