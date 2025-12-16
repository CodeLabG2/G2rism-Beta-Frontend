import { AdminSettingsManagement } from './settings/AdminSettingsManagement';

interface SettingsViewProps {
  canDelete?: boolean;
}

export function SettingsView({ canDelete }: SettingsViewProps) {
  return <AdminSettingsManagement />;
}