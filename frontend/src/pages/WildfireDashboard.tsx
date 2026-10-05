import { useState } from 'react';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import PredictionHistory from '../components/prediction/PredictionHistory';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';
import { predictionApi } from '../services/predictionApi';
import { Flame, ShieldCheck, AlertCircle } from 'lucide-react';

const WildfireDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<PredictionRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setResult(null);
    setLastRequest(null);
    setError(null);
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="text-orange-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight">Wildfire Risk Dashboard</h1>
              <p className="text-xs text-gray-500 font-medium">Environmental Monitoring System</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 text-sm font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            System Online
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Assess Wildfire Risk</h2>
          <p className="mt-2 text-lg text-gray-600 max-w-3xl">
            Enter the environmental conditions, geographic location, and date to generate a machine-learning estimate of wildfire ignition probability.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex items-start gap-3">
            <AlertCircle className="text-red-500 w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold text-lg">Prediction Failed</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {!result && (
            <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
          )}
          
          {result && lastRequest && (
            <div className="space-y-6 animate-fade-in-up">
              <PredictionResult response={result} requestData={lastRequest} />
              
              <button 
                onClick={handleReset}
                className="w-full py-4 px-6 text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold rounded-xl text-lg transition-colors shadow-sm border border-blue-200"
              >
                + Make Another Prediction
              </button>
            </div>
          )}

          <PredictionHistory key={result?.prediction_id || 'history'} />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">FDM Mini Project &copy; 2026</span>
          </div>
          <div className="text-sm text-gray-400">
            Powered by XGBoost Machine Learning
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WildfireDashboard;
