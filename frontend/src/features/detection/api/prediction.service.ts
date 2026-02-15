// src/features/detection/api/prediction.service.ts
import { api } from '@/lib/http/axios';

export interface PredictionResult {
  _id: string;
  imagePath: string;
  crop: 'banana' | 'rice' | 'coffee';
  result: {
    disease: string;
    confidence: number;
    recommendations: string[];
  };
  createdAt: string;
}

export const predictionService = {
  // Function to send the image and crop type
  predict: async (file: File, crop: string, lat?: number, lon?: number): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop', crop);
    
    if (lat) formData.append('lat', lat.toString());
    if (lon) formData.append('lon', lon.toString());

    // Assuming your backend route is /api/predict/analyze based on typical patterns
    // or just /api/predict depending on your routes file.
    // Let's assume it is POST /api/predict based on your previous messages.
    const response = await api.post('/predict/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  getHistory: async (): Promise<PredictionResult[]> => {
    const response = await api.get('/predict');
    return response.data;
  }
};