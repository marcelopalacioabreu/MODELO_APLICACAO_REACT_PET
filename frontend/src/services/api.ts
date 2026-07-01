import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_BACKEND_URL || 'http://backend:5000/api'; 
  }
  // In the browser prefer an explicit NEXT_PUBLIC_API_URL if provided (e.g. http://localhost:5001/api),
  // otherwise keep the relative `/api` so Next's rewrites/proxy work.
  return (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL)
    ? process.env.NEXT_PUBLIC_API_URL
    : '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, 
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
});

api.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/login')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login?reason=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

// --- EXPORTS DE ELITE (Garantir que todos estão aqui) ---

export const loginUser = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getRoles = async () => {
  const { data } = await api.get('/admin/roles');
  return data;
};

export const updateRolePermissions = async (id: string, permissionIds: string[]) => {
  const { data } = await api.put(`/admin/roles/${id}/permissions`, { permissionIds });
  return data;
};

export const getPermissions = async () => {
  const { data } = await api.get('/admin/permissions');
  return data;
};

export const getFunctionalities = async () => {
  const { data } = await api.get('/admin/functionalities');
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const getTutores = async () => {
  const { data } = await api.get('/tutores');
  return data;
};

export const getPets = async () => {
  const { data } = await api.get('/pets');
  return data;
};

export const getMenuData = async (name: string) => {
  const { data } = await api.get(`/menus/${name}`);
  return data;
};

export default api;
