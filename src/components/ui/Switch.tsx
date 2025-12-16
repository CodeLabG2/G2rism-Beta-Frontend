import React from 'react';
import { motion } from 'motion/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Switch({ checked, onChange, label, disabled = false, size = 'md' }: SwitchProps) {
  const sizes = {
    sm: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5',
    },
    md: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
    },
  };

  return (
    <label className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`${sizes[size].track} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-2 ${
          checked ? 'bg-[#3A7AFE]' : 'bg-gray-300'
        }`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`${sizes[size].thumb} bg-white rounded-full shadow-sm ${
            checked ? sizes[size].translate : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}
