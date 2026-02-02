import { api } from '@/shared/lib/axios';
import { LoginFormValues, RegisterFormValues, AuthResponse } from '../types/auth.types';

export const authService = {
  login: async (data: LoginFormValues) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  
  register: async (data: RegisterFormValues) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }
};