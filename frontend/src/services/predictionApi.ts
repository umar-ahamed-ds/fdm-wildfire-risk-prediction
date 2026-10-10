import axios from 'axios';
import type { PredictionRequest, PredictionResponse, PredictionHistoryRecord } from '../types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictionApi = {
  async assessRisk(data: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await apiClient.post<PredictionResponse>('/api/v1/predictions', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('Network error or backend is unavailable. Please try again later.');
    }
  },

  async getPredictionHistory(): Promise<PredictionHistoryRecord[]> {
    try {
      const response = await apiClient.get<PredictionHistoryRecord[]>('/api/v1/predictions');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch prediction history.');
    }
  },

  async getPrediction(predictionId: string): Promise<PredictionHistoryRecord> {
    try {
      const response = await apiClient.get<PredictionHistoryRecord>(`/api/v1/predictions/${predictionId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Prediction not found.');
      }
      throw new Error('Failed to fetch prediction details.');
    }
  },

  async searchLocations(query: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/api/v1/locations/search?q=${encodeURIComponent(query)}`);
      return response.data.results || [];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        throw new Error(error.response.data?.detail || 'Location API is not configured.');
      }
      throw new Error('Failed to fetch locations.');
    }
  },

  downloadPredictionReport(predictionId: string): void {
    // We navigate to the endpoint to trigger the browser download directly
    window.location.href = `${API_BASE_URL}/api/v1/predictions/${predictionId}/report`;
  }
};
