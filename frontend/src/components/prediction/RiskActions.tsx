import React from 'react';
import { ShieldAlert, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskActionsProps {
  riskLevel: string;
  guidance: string[];
}

const RiskActions: React.FC<RiskActionsProps> = ({ riskLevel, guidance }) => {
  let bgClass = 'bg-gray-50 border-gray-200';
  let titleClass = 'text-gray-800';
  let Icon = Info;
  let iconClass = 'text-gray-500';

  if (riskLevel === 'High Risk') {
    bgClass = 'bg-red-50 border-red-200';
    titleClass = 'text-red-800';
    Icon = ShieldAlert;
    iconClass = 'text-red-600';
  } else if (riskLevel === 'Medium Risk') {
    bgClass = 'bg-yellow-50 border-yellow-200';
    titleClass = 'text-yellow-800';
    Icon = AlertTriangle;
    iconClass = 'text-yellow-600';
  } else if (riskLevel === 'Low Risk') {
    bgClass = 'bg-blue-50 border-blue-200';
    titleClass = 'text-blue-800';
    Icon = Info;
    iconClass = 'text-blue-600';
  } else if (riskLevel === 'No Risk') {
    bgClass = 'bg-green-50 border-green-200';
    titleClass = 'text-green-800';
    Icon = ShieldCheck;
    iconClass = 'text-green-600';
  }

  return (
    <div className={`p-5 rounded-xl border ${bgClass} shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${iconClass}`} />
        <h4 className={`text-lg font-semibold ${titleClass}`}>
          {riskLevel === 'High Risk' && 'High Risk — Increase preparedness'}
          {riskLevel === 'Medium Risk' && 'Moderate Risk — Increased awareness recommended'}
          {riskLevel === 'Low Risk' && 'Low Risk — Continue normal monitoring'}
          {riskLevel === 'No Risk' && 'No Risk Detected'}
        </h4>
      </div>
      <ul className="space-y-2">
        {guidance.map((action, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></span>
            <span className="text-gray-700">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RiskActions;
