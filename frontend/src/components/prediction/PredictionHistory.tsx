import React, { useEffect, useState } from 'react';
import type { PredictionHistoryRecord } from '../../types/prediction';
import { predictionApi } from '../../services/predictionApi';
import { Clock, MapPin, Download, AlertCircle, RefreshCw } from 'lucide-react';

const PredictionHistory: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await predictionApi.getPredictionHistory();
      setHistory(data);
    } catch (err) {
      setError('Unable to load prediction history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownload = (id: string) => {
    predictionApi.downloadPredictionReport(id);
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'High Risk') return 'text-red-700 bg-red-100 border-red-200';
    if (risk === 'Medium Risk') return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    if (risk === 'Low Risk') return 'text-blue-700 bg-blue-100 border-blue-200';
    return 'text-green-700 bg-green-100 border-green-200';
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Prediction History
        </h3>
        <button 
          onClick={fetchHistory}
          disabled={isLoading}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 flex items-center gap-2 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No previous predictions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-3 font-semibold rounded-tl-lg">Date</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Risk</th>
                <th className="p-3 font-semibold">Probability</th>
                <th className="p-3 font-semibold text-right rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {history.map((record) => (
                <tr key={record.prediction_id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-3 text-gray-700 font-medium whitespace-nowrap">
                    {record.assessment_date}
                  </td>
                  <td className="p-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {record.location.latitude.toFixed(2)}, {record.location.longitude.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskColor(record.prediction.risk_level)} whitespace-nowrap`}>
                      {record.prediction.risk_level}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700 font-medium">
                    {record.prediction.percentage.toFixed(1)}%
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDownload(record.prediction_id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition-colors inline-flex items-center gap-1"
                      title="Download PDF Report"
                    >
                      <Download className="w-4 h-4" />
                      <span className="sr-only">Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
