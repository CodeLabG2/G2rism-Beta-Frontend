import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200';
  
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'circular' ? width : '1rem'),
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} style={style} />;
}

export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-6 space-y-4">
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} />
      <Skeleton height={16} />
      <Skeleton height={16} width="80%" />
    </div>
  );
}
