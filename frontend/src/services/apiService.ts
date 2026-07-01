import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') return process.env.INTERNAL_BACKEND_URL || 'http://backend:5000/api';
  return (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ? process.env.NEXT_PUBLIC_API_URL : '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// AUTH
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

// ADMIN (roles/permissions/users)
export const getRoles = async () => { const { data } = await api.get('/admin/roles'); return data; };
export const getPermissions = async () => { const { data } = await api.get('/admin/permissions'); return data; };
export const getUsers = async () => { const { data } = await api.get('/admin/users'); return data; };

// TUTORES
export const getTutores = async () => { const { data } = await api.get('/tutores'); return data; };

// PETS (kept minimal)
export const getPets = async () => { const { data } = await api.get('/pets'); return data; };
export const createPet = async (formData: any) => { const { data } = await api.post('/pets', formData); return data; };

// LOCATIONS
export const getLocations = async () => { const { data } = await api.get('/locations'); return data; };

// CORE
export const getMenuData = async (name: string) => { const { data } = await api.get(`/menus/${name}`); return data; };

// NOTES - example module
export const getNotes = async () => { const { data } = await api.get('/notes'); return data; };
export const getNote = async (id: string) => { const { data } = await api.get(`/notes/${id}`); return data; };
export const createNote = async (payload: any) => { const { data } = await api.post('/notes', payload); return data; };
export const updateNote = async (id: string, payload: any) => { const { data } = await api.put(`/notes/${id}`, payload); return data; };
export const deleteNote = async (id: string) => { const { data } = await api.delete(`/notes/${id}`); return data; };

export default api;

// --- Stubs for removed/cleaned endpoints (keeps existing imports working)
const removed = async () => { throw new Error('Endpoint removed during cleanup. Implement or restore if needed.'); };

export const updateRolePermissions = removed;
export const resetUserPassword = removed;
export const updateUserStatus = removed;

export const searchTutorGlobal = removed;
export const getTutor = removed;
export const updateTutor = removed;
export const deleteTutor = removed;

export const getPet = removed;
export const updatePet = removed;
export const updatePetStatus = removed;
export const deletePet = removed;
export const getLostPets = removed;
export const getAdoptablePets = removed;

export const getPetTimeline = removed;
export const createMedicalRecord = removed;

export const getPublicFeed = removed;
export const createPost = removed;
export const likePost = removed;

export const getCampaigns = removed;
export const getCampaign = removed;
export const createCampaign = removed;
export const updateCampaign = removed;
export const deleteCampaign = removed;

export const createLocation = removed;
export const updateLocation = removed;
export const deleteLocation = removed;
export const getLocation = removed;
export const uploadFloorPlan = removed;

export const getProducts = removed;
export const createProduct = removed;
export const updateProduct = removed;
export const deleteProduct = removed;
export const getStockByLocation = removed;
export const addStockEntry = removed;
export const getMyStock = removed;
export const getSubUnitsStock = removed;
export const transferStock = removed;
export const dispenseStock = removed;
export const bulkDispenseStock = removed;
export const getInventoryTransactions = removed;

export const getAppointments = removed;
export const createAppointment = removed;
export const getTriageQueue = removed;
export const checkInPet = removed;

export const getBeds = removed;
export const createBed = removed;
export const updateBedPosition = removed;
export const updateBedStatus = removed;

export const getMyNetwork = removed;

export const getFileURL = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path;
};
