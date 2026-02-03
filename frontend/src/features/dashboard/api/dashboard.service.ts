import { api } from '@/shared/lib/axios';

export interface TaskData {
  _id: string;
  titulo: string;
  tipo: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaProgramada: string;
}

export interface DashboardSummary {
  mode?: 'active' | 'setup_required'; // Controla si mostramos datos o el wizard
  usuario: string;
  context?: {
    farmId: string;
    farmName: string;
  };
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
  agenda?: {
    tareasHoy: TaskData[];
    totalAtrasadas: number;
  };
}

export const dashboardService = {
  getSummary: async (farmId?: string): Promise<DashboardSummary> => {
    const params = new URLSearchParams();
    if (farmId) params.append('farmId', farmId);
    
    const response = await api.get(`/dashboard/summary?${params.toString()}`);
    return response.data.data;
  }
};