import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';
import { predictionApi } from '../services/predictionApi';
import { AlertCircle } from 'lucide-react';
import { Navbar, Footer } from './WildfireRisklandingpage';

const WildfireDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<PredictionRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setResult(null);
    setLastRequest(null);
    setError(null);
    navigate('/history');
  };

  const handlePredict = async (data: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastRequest(data);

    try {
      const response = await predictionApi.assessRisk(data);
      setResult(response);
    } catch (err: any) {
      if (err.detail) {
        if (Array.isArray(err.detail)) {
          const message = err.detail.map((e: any) => `${e.loc?.join('.')} ${e.msg}`).join(', ');
          setError(`Validation Error: ${message}`);
        } else {
          setError(`Server Error: ${err.detail}`);
        }
      } else {
        setError(err.message || 'An unexpected error occurred while communicating with the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EFE4] text-[#1E2330] font-sans flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif sm:text-4xl">Assess Wildfire Risk</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Enter the environmental conditions, geographic location, and date to generate a machine-learning estimate of wildfire ignition probability.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start gap-3 max-w-4xl mx-auto">
            <AlertCircle className="text-red-500 w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold text-lg">Prediction Failed</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
        </div>
      </main>
      
      {/* Prediction Result Modal Overlay */}
      {result && lastRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <PredictionResult 
            response={result} 
            requestData={lastRequest}
            onClose={handleCloseModal}
            onViewHistory={handleCloseModal}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WildfireDashboard;
