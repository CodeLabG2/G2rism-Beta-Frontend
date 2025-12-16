import { EmployeesManagement } from './employees/EmployeesManagement';

interface EmployeesViewProps {
  canDelete?: boolean;
}

export function EmployeesView({ canDelete }: EmployeesViewProps) {
  return <EmployeesManagement />;
}
