import React, { useEffect, useRef, useState } from 'react';
import type { PredictionResponse, PredictionRequest } from '../../types/prediction';
import RiskGauge from './RiskGauge';
import RiskActions from './RiskActions';
import EnvironmentalSummary from './EnvironmentalSummary';
import { MapPin, Calendar, Activity, Download } from 'lucide-react';
import { predictionApi } from '../../services/predictionApi';

interface PredictionResultProps {
  response: PredictionResponse;
  requestData: PredictionRequest;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ response, requestData }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Scroll to the results when they appear
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [response]);

  const handleDownload = () => {
    setIsDownloading(true);
    predictionApi.downloadPredictionReport(response.prediction_id);
    setTimeout(() => setIsDownloading(false), 2000); // Reset state after a short delay
  };

  return (
    <div ref={resultRef} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-blue-600" />
          Prediction Result
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded border border-blue-200">
            Model: {response.model_name}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded border border-gray-200 uppercase">
            ID: {response.prediction_id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Gauge and Basic Info */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <RiskGauge percentage={response.percentage} riskLevel={response.risk_level} />
          
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <MapPin className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Location</span>
              <span className="font-medium text-gray-800 mt-1">
                {response.location.latitude.toFixed(4)}, {response.location.longitude.toFixed(4)}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <Calendar className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Date</span>
              <span className="font-medium text-gray-800 mt-1">{response.assessment_date}</span>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors disabled:bg-gray-600"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Generating Report...' : 'Download Assessment Report'}
          </button>
        </div>

        {/* Right Column: Guidance */}
        <div className="flex flex-col justify-center">
          <RiskActions riskLevel={response.risk_level} guidance={response.guidance} />
        </div>
      </div>

      <EnvironmentalSummary data={requestData} />

      <div className="mt-8 text-xs text-gray-400 text-center border-t pt-4">
        {response.disclaimer}
      </div>
    </div>
  );
};

export default PredictionResult;
