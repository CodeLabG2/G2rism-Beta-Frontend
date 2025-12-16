import React from 'react';
import { PackagesView as AdminPackagesView } from '../../admin/views/PackagesView';
import type { PermissionSummary } from '../../../services/types/roles.types';

interface PackagesViewProps {
  permissions: PermissionSummary[];
}

export function PackagesView({ permissions }: PackagesViewProps) {
  return <AdminPackagesView />;
}
