import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg transition-all duration-200 border font-medium';
  
  const variants = {
    primary: 'bg-[#3A7AFE] text-white border-[#3A7AFE] hover:bg-[#2563eb] hover:shadow-lg disabled:bg-gray-300 disabled:border-gray-300',
    secondary: 'bg-transparent text-[#3A7AFE] border-[#3A7AFE] hover:bg-[#3A7AFE] hover:text-white disabled:border-gray-300 disabled:text-gray-300',
    danger: 'bg-[#EF4444] text-white border-[#EF4444] hover:bg-[#DC2626] hover:shadow-lg disabled:bg-gray-300 disabled:border-gray-300',
    success: 'bg-[#10B981] text-white border-[#10B981] hover:bg-[#059669] hover:shadow-lg disabled:bg-gray-300 disabled:border-gray-300',
    ghost: 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 disabled:text-gray-300',
  };

  const sizes = {
    sm: 'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm',
    md: 'px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base',
    lg: 'px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </motion.button>
  );
}