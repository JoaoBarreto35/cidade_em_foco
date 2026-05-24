import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import { getCategoryById } from '../../utils/categories';
import styles from './styles.module.css';

export function MapPage() {
  return (
    <div className="page section">
      <PageHeader
        eyebrow="Mapa comunitário"
        title="Pontos registrados"
        description="Nesta fase, o mapa está mockado. Depois vamos integrar com Leaflet e Supabase."
        action={<Button to="/occurrences/new">Registrar</Button>}
      />

      <Card className={styles.mapMock}>
        <span>🗺️</span>
        <strong>Mapa interativo</strong>
        <small>Os pins reais entram na fase de integração com Leaflet.</small>
      </Card>

      <section className={styles.nearbyList}>
        {occurrencesMock.map((occurrence) => {
          const category = getCategoryById(occurrence.category);

          return (
            <Card key={occurrence.id} className={styles.nearbyCard}>
              <span className={styles.icon}>{category.icon}</span>
              <div>
                <strong>{occurrence.title}</strong>
                <p>{occurrence.neighborhood} • {occurrence.reference}</p>
              </div>
              <Badge tone="info">Pin</Badge>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
