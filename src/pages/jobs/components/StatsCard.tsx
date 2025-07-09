import React from 'react';
import { Card } from 'antd';

interface StatsCardProps {
  label: string;
  value: number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, color }) => {
  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'text-purple-600 bg-purple-50',
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      gray: 'text-gray-600 bg-gray-50'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getIcon = (color: string) => {
    const icons = {
      purple: '✨',
      green: '✅',
      blue: '⏳',
      gray: '✔️'
    };
    return icons[color as keyof typeof icons] || '📋';
  };

  return (
    <Card className="hover:shadow-md transition-shadow" bodyStyle={{ padding: '20px', height: '80px' }}>
      <div className="flex items-center justify-between h-full">
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</div>
          <div className="text-gray-600 text-sm leading-none">{label}</div>
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getColorClasses(color)}`}>
          <span className="text-xl">{getIcon(color)}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;