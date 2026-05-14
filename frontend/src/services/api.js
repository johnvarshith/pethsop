import axios from 'axios';

// Central axios instance — all API calls go through here
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true, // sends HttpOnly JWT cookie automatically
  headers: { 'Content-Type': 'application/json' },
});


// Request interceptor — good place to add loading states globally
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — handles 401 globally (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear any local state, redirect to login
      // Prevent infinite loop if already on login or just checking session on mount
      if (window.location.pathname !== '/login' && error.config.url !== '/api/user') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/api/login', data),
  signup: (data) => api.post('/api/signup', data),
  getUser: () => api.get('/api/user'),
  logout: () => api.post('/logout'),
};

// ─── Products ────────────────────────────────────────────
export const productsAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

// ─── Pets (Adoption) ─────────────────────────────────────
export const petsAPI = {
  getAll: (params) => api.get('/api/pets', { params }),
  getById: (id) => api.get(`/api/pets/${id}`),
  create: (data) => api.post('/api/pets', data),
  favorite: (id) => api.post(`/api/pets/${id}/favorite`),
};

// ─── Appointments ────────────────────────────────────────
export const appointmentsAPI = {
  create: (data) => api.post('/api/appointments', data),
  getMine: () => api.get('/api/appointments'),
  cancel: (id) => api.delete(`/api/appointments/${id}`),
};

// ─── Orders ──────────────────────────────────────────────
export const ordersAPI = {
  place: (data) => api.post('/api/orders', data),
  getMine: () => api.get('/api/orders'),
};

// ─── AI ──────────────────────────────────────────────────
export const aiAPI = {
  chat: (data) => api.post('/api/chat', data),
  matchmaker: (data) => api.post('/api/matchmaker', data),
  getChatHistory: () => api.get('/api/chat/history'),
};

// ─── Admin ───────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getOrders: (params) => api.get('/api/admin/orders', { params }),
  getAppointments: (params) => api.get('/api/admin/appointments', { params }),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }),
};

export default api;
