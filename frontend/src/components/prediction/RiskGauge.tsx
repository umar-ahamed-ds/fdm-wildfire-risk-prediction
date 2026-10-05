import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskGaugeProps {
  percentage: number;
  riskLevel: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ percentage, riskLevel }) => {
  const data = [
    { name: 'Risk', value: percentage },
    { name: 'Safe', value: 100 - percentage },
  ];

  let color = '#22c55e'; // Green for No Risk/Low Risk
  if (riskLevel === 'Medium Risk') color = '#eab308'; // Yellow
  if (riskLevel === 'High Risk') color = '#ef4444'; // Red

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center flex flex-col items-center">
        <span className="text-4xl font-bold text-gray-800">{percentage.toFixed(1)}%</span>
        <span className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{riskLevel}</span>
      </div>
    </div>
  );
};

export default RiskGauge;
