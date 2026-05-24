import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import { formatDate } from '../../utils/formatDate';
import { getCategoryById } from '../../utils/categories';
import { getStatusInfo } from '../../utils/statusLabels';
import styles from './styles.module.css';

export function OccurrencesList() {
  return (
    <div className="page section">
      <PageHeader
        eyebrow="Ocorrências públicas"
        title="Acompanhe os registros"
        description="Veja os problemas cadastrados pela comunidade e acompanhe a evolução das resoluções."
        action={<Button to="/occurrences/new">Nova ocorrência</Button>}
      />

      <section className={styles.filters}>
        <button type="button">Todas</button>
        <button type="button">Abertas</button>
        <button type="button">Resolvidas</button>
        <button type="button">Revisão</button>
      </section>

      <section className={styles.list}>
        {occurrencesMock.map((occurrence) => {
          const category = getCategoryById(occurrence.category);
          const statusInfo = getStatusInfo(occurrence.status);
          const progressPercent = Math.min((occurrence.resolutionVotesCount / 3) * 100, 100);

          return (
            <Link to={`/occurrences/${occurrence.id}`} key={occurrence.id}>
              <Card className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}>{category.icon}</span>
                  <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                </div>

                <h2>{occurrence.title}</h2>
                <p>{occurrence.description}</p>

                <div className={styles.meta}>
                  <span>{occurrence.neighborhood}</span>
                  <span>{formatDate(occurrence.createdAt)}</span>
                </div>

                <div className={styles.progressArea}>
                  <div className={styles.progressHeader}>
                    <span>Resolução</span>
                    <strong>{occurrence.resolutionVotesCount}/3</strong>
                  </div>
                  <div className={styles.progressTrack}>
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
