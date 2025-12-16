import { InvoicingManagement } from './invoicing/InvoicingManagement';

interface InvoicingViewProps {
  canDelete?: boolean;
}

export function InvoicingView({ canDelete }: InvoicingViewProps) {
  return <InvoicingManagement />;
}
