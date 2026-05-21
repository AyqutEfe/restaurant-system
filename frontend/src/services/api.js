import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public endpoints
export const getMenu = () => api.get('/api/menu');
export const createReservation = (data) => api.post('/api/reservations', data);

// Admin endpoints
export const getAdminReservations = () => api.get('/admin/reservations');
export const updateReservationStatus = (id, status) =>
  api.put(`/admin/reservations/${id}/status`, { status });
export const getAdminMenu = () => api.get('/admin/menu');
export const createMenuItem = (data) => api.post('/admin/menu', data);
export const updateMenuItem = (id, data) => api.put(`/admin/menu/${id}`, data);
export const toggleMenuItemAvailability = (id) => api.put(`/admin/menu/${id}/toggle`);

// Webhook-ready: future integrations can add interceptors here
export default api;
