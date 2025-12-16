import React, { useState } from 'react';
import { TransportManagement } from './transport/TransportManagement';
import { TransportExamples } from './transport/TransportExamples';
import { TransportUseCases } from './transport/TransportUseCases';
import { Button } from '../../ui/Button';
import { Eye, Grid, BookOpen } from 'lucide-react';

type ViewMode = 'management' | 'examples' | 'usecases';

export function TransportView() {
  const [viewMode, setViewMode] = useState<ViewMode>('management');

  return (
    <div>
      {/* Navegación entre vistas */}
      <div className="mb-4 flex justify-end gap-2">
        <Button
          variant={viewMode === 'management' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('management')}
        >
          <Grid size={18} />
          Gestión
        </Button>
        <Button
          variant={viewMode === 'examples' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('examples')}
        >
          <Eye size={18} />
          Ejemplos
        </Button>
        <Button
          variant={viewMode === 'usecases' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('usecases')}
        >
          <BookOpen size={18} />
          Casos de Uso
        </Button>
      </div>

      {/* Contenido */}
      {viewMode === 'management' && <TransportManagement />}
      {viewMode === 'examples' && <TransportExamples />}
      {viewMode === 'usecases' && <TransportUseCases />}
    </div>
  );
}
