import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Customer, CustomerSummary, OrderPayload, OrderSummary, Product } from '../types';

// Prefer Vite-style env, fall back to CRA-style, then to same-origin /api, then localhost.
const envBase =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.REACT_APP_API_URL as string | undefined);

// Prefer explicit env, otherwise fall back to relative /api so dev proxy or same-origin backend works.
const API_BASE_URL = (envBase ? envBase.replace(/\/$/, '') : null) ?? '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number | string) => api.get<Customer>(`/customers/${id}`),
  create: (data: Pick<Customer, 'firstName' | 'lastName' | 'email'>) =>
    api.post('/customers', data),
  update: (id: number, data: Pick<Customer, 'firstName' | 'lastName' | 'email'>) =>
    api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
  getSummary: (id: number | string) => api.get<CustomerSummary>(`/customers/${id}/summary`),
};

export const productApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number | string) => api.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) => api.post('/products', data),
  update: (id: number, data: Omit<Product, 'id'>) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const orderApi = {
  getAll: () => api.get<OrderSummary[]>('/orders'),
  getById: (id: number | string) => api.get<OrderSummary>(`/orders/${id}`),
  create: (data: OrderPayload) => api.post('/orders', data),
  update: (id: number, data: OrderPayload) => api.put(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
  getSummary: (id: number | string) => api.get<OrderSummary>(`/orders/${id}/summary`),
};

export default api;
