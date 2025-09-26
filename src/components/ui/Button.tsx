import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border';
  
  const variantClasses = {
    primary: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-100 hover:text-white shadow-lg hover:shadow-blue-500/25',
    secondary: 'bg-white/10 hover:bg-white/20 border-white/20 text-white/80 hover:text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-100 hover:text-white shadow-lg hover:shadow-red-500/25',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}