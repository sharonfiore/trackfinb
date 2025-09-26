import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glassEffect?: boolean;
}

export function Card({ children, className = '', glassEffect = true }: CardProps) {
  const baseClasses = 'rounded-2xl border shadow-xl';
  const glassClasses = glassEffect 
    ? 'bg-white/10 backdrop-blur-lg border-white/20' 
    : 'bg-white border-gray-200';
  
  return (
    <div className={`${baseClasses} ${glassClasses} ${className}`}>
      {children}
    </div>
  );
}