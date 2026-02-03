import { api } from '@/shared/lib/axios';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  category: string;
  date: string;
  image: string;
}

export interface MarketPrice {
  name: string;
  price: string;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
}

export const newsService = {
  getLatestNews: async (): Promise<NewsArticle[]> => {
    const response = await api.get('/news');
    return response.data;
  },

  getMarketPrices: async (): Promise<MarketPrice[]> => {
    const response = await api.get('/news/prices');
    return response.data;
  }
};