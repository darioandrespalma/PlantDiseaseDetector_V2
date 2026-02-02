import { api } from '@/shared/lib/axios';

export interface DashboardSummary {
  usuario: string;
  lunar: {
    fase: string;
    mensaje: string;
  };
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
  getSummary: async (): Promise<DashboardSummary> => {
    const { data } = await api.get('/dashboard/summary');
    return data.data;
  },
};