import { create } from 'zustand';
import { api } from '@/lib/http/axios';

export interface Farm {
  _id: string;
  nombre: string;
  ubicacion: { lat: number; lon: number };
}

interface FarmState {
  farms: Farm[];
  currentFarm: Farm | null;
  isLoading: boolean;
  
  fetchFarms: () => Promise<void>;
  setCurrentFarm: (farmId: string) => void;
  createFarm: (data: any) => Promise<boolean>;
}

export const useFarmStore = create<FarmState>((set, get) => ({
  farms: [],
  currentFarm: null,
  isLoading: false,

  fetchFarms: async () => {
    set({ isLoading: true });
    try {
      // Asegúrate de que esta ruta '/farms' exista en tu backend (farmRoutes.js)
      const res = await api.get('/farms');
      const farms = res.data.data;
      
      set({ farms });
      
      // Si hay fincas y no hay una seleccionada, seleccionar la primera por defecto
      if (farms.length > 0 && !get().currentFarm) {
        set({ currentFarm: farms[0] });
      }
    } catch (error) {
      console.error('Error fetching farms', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentFarm: (farmId: string) => {
    const farm = get().farms.find(f => f._id === farmId);
    if (farm) {
      set({ currentFarm: farm });
    }
  },

  createFarm: async (data) => {
    try {
      const res = await api.post('/farms', data);
      const newFarm = res.data.data;
      
      // Actualizar lista y seleccionar la nueva inmediatamente
      set(state => ({ 
        farms: [...state.farms, newFarm],
        currentFarm: newFarm
      }));
      return true;
    } catch (error) {
      console.error('Error creating farm', error);
      return false;
    }
  }
}));
