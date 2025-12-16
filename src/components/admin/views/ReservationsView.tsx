import { ReservationsManagement } from './reservations/ReservationsManagement';

interface ReservationsViewProps {
  canDelete?: boolean;
}

export function ReservationsView({ canDelete }: ReservationsViewProps) {
  return <ReservationsManagement />;
}