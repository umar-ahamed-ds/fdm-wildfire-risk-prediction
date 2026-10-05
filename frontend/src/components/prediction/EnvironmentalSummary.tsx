import React from 'react';
import type { PredictionRequest } from '../../types/prediction';

interface EnvironmentalSummaryProps {
  data: PredictionRequest;
}

const EnvironmentalSummary: React.FC<EnvironmentalSummaryProps> = ({ data }) => {
  const cards = [
    { label: 'Temperature Range', value: `${data.temperature_min}°C - ${data.temperature_max}°C` },
    { label: 'Humidity Range', value: `${data.relative_humidity_min}% - ${data.relative_humidity_max}%` },
    { label: 'Precipitation', value: `${data.precipitation} mm` },
    { label: 'Wind Speed', value: `${data.wind_speed} m/s` },
    { label: 'Solar Radiation', value: `${data.solar_radiation} W/m²` },
    { label: 'Fuel Moisture (100h)', value: `${data.fuel_moisture_100hr}%` },
    { label: 'VPD', value: `${data.vapor_pressure_deficit} kPa` },
    { label: 'Burning Index', value: data.burning_index },
  ];

  return (
    <div className="mt-8">
      <h4 className="text-md font-semibold text-gray-700 mb-4 border-b pb-2">Environmental Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentalSummary;
