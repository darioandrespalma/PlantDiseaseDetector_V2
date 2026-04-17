// src/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. LA INTERFAZ DEBE COINCIDIR CON LO QUE LE PASAS DESDE EL LOGIN/REGISTER
interface User {
  id: string;        // Se queda como id porque así lo pasas en login(...)
  name: string;      // Se queda como name porque así lo pasas en login(...)
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'plant-auth-storage',
    }
  )
);