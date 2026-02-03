import { api } from '@/shared/lib/axios';

export interface DashboardSummary {
  usuario: string;
  clima: {
    ubicacion: string;
    temp: number | null;
    descripcion?: string;
  };
  lunar: { fase: string; mensaje: string };
  estadisticas: {
    totalLotes: number;
    lotesSanos: number;
    lotesAlerta: number;
  };
  actividadReciente: {
    crop: string;
    prediction: string;
    confidence: number;
    createdAt: string;
  } | null;
}

export const dashboardService = {
  // Ahora acepta coordenadas opcionales
  getSummary: async (lat?: number, lon?: number): Promise<DashboardSummary> => {
    // Si existen coordenadas, las añadimos a la URL
    const query = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    const response = await api.get(`/dashboard/summary${query}`);
    return response.data.data;
  }
};