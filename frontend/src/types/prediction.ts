export interface PredictionRequest {
  location_name?: string;
  latitude: number;
  longitude: number;
  assessment_date: string; // YYYY-MM-DD
  precipitation: number;
  relative_humidity_max: number;
  relative_humidity_min: number;
  specific_humidity: number;
  solar_radiation: number;
  temperature_min: number;
  temperature_max: number;
  wind_speed: number;
  burning_index: number;
  fuel_moisture_100hr: number;
  fuel_moisture_1000hr: number;
  energy_release_component: number;
  reference_evapotranspiration: number;
  potential_evapotranspiration: number;
  vapor_pressure_deficit: number;
}

export interface LocationResponse {
  name?: string;
  latitude: number;
  longitude: number;
}

export interface PredictionResponse {
  prediction_id: string;
  probability: number;
  percentage: number;
  risk_level: 'No Risk' | 'Low Risk' | 'Medium Risk' | 'High Risk';
  model_name: string;
  assessment_date: string;
  location: LocationResponse;
  guidance: string[];
  disclaimer: string;
}

export interface PredictionHistoryRecord {
  prediction_id: string;
  created_at: string;
  assessment_date: string;
  location: {
    name?: string;
    latitude: number;
    longitude: number;
  };
  prediction: {
    probability: number;
    percentage: number;
    risk_level: string;
  };
  model: {
    name: string;
  };
  input_features?: any;
}

export interface ApiError {
  detail: string | any[];
}
