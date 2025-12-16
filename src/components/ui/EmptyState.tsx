import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="w-16 h-16 mb-4 text-gray-400 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h6 className="mb-2 text-center text-gray-900">{title}</h6>
      {description && <p className="text-center text-gray-600 mb-6 max-w-md">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
