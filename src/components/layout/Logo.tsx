import React from 'react';
import { Compass } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export function Logo({ size = 'md', variant = 'dark', className = '', onClick }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 36, text: 'text-3xl' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-[#1A2440]';

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="p-1.5 bg-gradient-to-br from-[#3A7AFE] to-[#1A2440] rounded-lg">
        <Compass size={sizes[size].icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`${sizes[size].text} ${textColor}`}>
        <strong>G2</strong>rism
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-2 rounded-lg transition-transform hover:scale-105"
        aria-label="Volver al inicio"
      >
        {content}
      </button>
    );
  }

  return content;
}