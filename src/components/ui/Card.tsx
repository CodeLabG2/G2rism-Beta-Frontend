import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({ children, className = '', hover = false, onClick, header, footer }: CardProps) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden ${ onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      {...hoverProps}
    >
      {header && <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4 border-b border-gray-100">{header}</div>}
      <div className="p-3 sm:p-4 md:p-6">{children}</div>
      {footer && <div className="px-3 sm:px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 bg-gray-50">{footer}</div>}
    </Component>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  change?: {
    value: number;
    positive: boolean;
  };
  color?: string;
}

export function MetricCard({ icon, value, label, change, color = '#3A7AFE' }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 truncate">{label}</p>
          <h3 className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl">{value}</h3>
          {change && (
            <div className={`flex items-center gap-1 text-xs sm:text-sm ${change.positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              <span>{change.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        <div
          className="p-2 sm:p-3 rounded-lg shrink-0"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}