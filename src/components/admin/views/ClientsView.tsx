import { CRMManagement } from './crm/CRMManagement';

interface ClientsViewProps {
  canDelete?: boolean;
}

export function ClientsView({ canDelete }: ClientsViewProps) {
  return <CRMManagement />;
}