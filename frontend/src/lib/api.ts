import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set token in header if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  loginWithWallet: (walletAddr: string, signature: string, message: string) =>
    api.post('/auth/login-wallet', { wallet_addr: walletAddr, signature, message }),
};

export const capsuleAPI = {
  create: (title: string, description: string, fileHash: string, unlockTime: number) =>
    api.post('/capsules', { title, description, file_hash: fileHash, unlock_time: unlockTime }),
  list: () =>
    api.get('/capsules'),
  get: (id: string) =>
    api.get(`/capsules/${id}`),
  update: (id: string, title: string, description: string, unlockTime: number) =>
    api.put(`/capsules/${id}`, { title, description, unlock_time: unlockTime }),
  delete: (id: string) =>
    api.delete(`/capsules/${id}`),
  sign: (id: string, signature: string, message?: string) =>
    api.post(`/capsules/${id}/sign`, { signature, message }),
  checkUnlock: (id: string) =>
    api.get(`/capsules/${id}/unlock`),
  unlock: (id: string) =>
    api.post(`/capsules/${id}/unlock`),
};

export const auditAPI = {
  getForCapsule: (id: string) =>
    api.get(`/capsules/${id}/audit`),
  getAll: () =>
    api.get('/audit'),
};

export const statsAPI = {
  getDashboard: () =>
    api.get('/dashboard/stats'),
  getPublic: () =>
    api.get('/public/stats'),
};

export default api;
