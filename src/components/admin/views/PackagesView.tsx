import { PackagesManagement } from './packages/PackagesManagement';

interface PackagesViewProps {
  canDelete?: boolean;
}

export function PackagesView({ canDelete }: PackagesViewProps) {
  return <PackagesManagement />;
}
