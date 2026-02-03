import { api } from '@/shared/lib/axios';

export interface Lote {
  _id: string;
  nombre: string;
  cultivoData: {
    _id: string;
    nombre: string;
    categoria: string;
    diasCosecha: number;
  };
  area: number;
  fechaSiembra: string;
  edadDias: number; // Calculado por el backend
  estadoSalud: 'saludable' | 'riesgo' | 'peligro';
  ubicacion: {
    lat: number;
    lon: number;
  };
  recomendacionesDelDia?: any[];
}

export const lotsService = {
  // Obtener lotes filtrados por Finca (Smart Lots)
  getByFarm: async (farmId: string): Promise<Lote[]> => {
    const response = await api.get(`/lotes?farmId=${farmId}`);
    return response.data.data;
  },

  // Crear Lote (Vinculando Finca + Cultivo)
  create: async (data: any): Promise<Lote> => {
    const response = await api.post('/lotes', data);
    return response.data.data;
  },

  // Obtener Catálogo de Cultivos (Para el dropdown)
  getCrops: async () => {
    const response = await api.get('/cultivos');
    return response.data.data;
  }
};