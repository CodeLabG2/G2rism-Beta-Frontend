import React from 'react';
import { UsersManagement } from './users/UsersManagement';

interface UsersViewProps {
  canDelete: boolean;
}

export function UsersView({ canDelete }: UsersViewProps) {
  return <UsersManagement />;
}
