import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export function ProgressBar({ 
  value, 
  max, 
  className = '', 
  showLabel = false,
  color = 'blue'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-white/80">
          <span>${value.toLocaleString()}</span>
          <span>${max.toLocaleString()}</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-center text-xs text-white/60">
          {percentage.toFixed(1)}% completado
        </div>
      )}
    </div>
  );
}