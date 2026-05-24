import { useMemo } from 'react';

import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getOccurrences } from '../../services/occurrencesLocalService';

import styles from './styles.module.css';

export function MapPage() {
  const occurrences = useMemo(() => getOccurrences(), []);

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Mapa"
        title="Mapa da comunidade"
        description="Nesta fase, o mapa ainda está mockado, mas a lista já usa as ocorrências criadas no navegador."
        action={<Button to="/occurrences/new">Registrar</Button>}
      />

      <Card className={styles.mapMock}>
        <span>🗺️</span>
        <strong>Mapa interativo</strong>
        <p>Próxima fase: Leaflet com pins usando latitude, longitude e mapa de calor.</p>
      </Card>

      <section className="section">
        {occurrences.slice(0, 3).map((occurrence) => (
          <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
        ))}
      </section>
    </div>
  );
}
