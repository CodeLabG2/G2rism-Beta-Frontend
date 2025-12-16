import { SalesManagement } from './sales/SalesManagement';

interface SalesViewProps {
  canDelete?: boolean;
}

export function SalesView({ canDelete }: SalesViewProps) {
  return <SalesManagement />;
}
