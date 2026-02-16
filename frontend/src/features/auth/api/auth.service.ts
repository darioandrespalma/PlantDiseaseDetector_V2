import { api } from '@/lib/http/axios';
import { LoginFormValues, RegisterFormValues, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (data: LoginFormValues) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterFormValues) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    // Nota: El backend devuelve { success: true, message: ... }
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    // Usamos PUT porque estamos actualizando un recurso
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  }

};