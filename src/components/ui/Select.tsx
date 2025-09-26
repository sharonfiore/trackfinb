import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2.5 
          bg-white/10 backdrop-blur-sm
          border border-white/20 
          rounded-xl 
          text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
          transition-all duration-200
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}