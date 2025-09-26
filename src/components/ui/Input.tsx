import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 
          bg-white/10 backdrop-blur-sm
          border border-white/20 
          rounded-xl 
          text-white placeholder-white/50
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
          transition-all duration-200
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}