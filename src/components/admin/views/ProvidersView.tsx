import React from 'react';
import { ProvidersManagement } from './providers/ProvidersManagement';

interface ProvidersViewProps {
  canDelete: boolean;
}

export function ProvidersView({ canDelete }: ProvidersViewProps) {
  return <ProvidersManagement />;
}
