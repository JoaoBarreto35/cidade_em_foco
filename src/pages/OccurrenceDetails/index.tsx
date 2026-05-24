import { useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { occurrencesMock } from '../../mocks/occurrencesMock';
import { formatDate } from '../../utils/formatDate';
import { getCategoryById } from '../../utils/categories';
import { getStatusInfo } from '../../utils/statusLabels';
import styles from './styles.module.css';

export function OccurrenceDetails() {
  const { id } = useParams();
  const occurrence = occurrencesMock.find((item) => item.id === id);

  if (!occurrence) {
    return <EmptyState title="Ocorrência não encontrada" description="O registro solicitado não está disponível." actionLabel="Voltar para lista" actionTo="/occurrences" />;
  }

  const category = getCategoryById(occurrence.category);
  const statusInfo = getStatusInfo(occurrence.status);
  const progressPercent = Math.min((occurrence.resolutionVotesCount / 3) * 100, 100);

  return (
    <div className="page section">
      <PageHeader eyebrow={category.label} title={occurrence.title} description={occurrence.description} />

      <Card className={styles.photoMock}>
        <span>{category.icon}</span>
        <strong>Foto da ocorrência</strong>
        <small>Preview mockado nesta fase</small>
      </Card>

      <Card className={styles.infoCard}>
        <div className={styles.row}>
          <span>Status</span>
          <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
        </div>
        <div className={styles.row}>
          <span>Bairro</span>
          <strong>{occurrence.neighborhood}</strong>
        </div>
        <div className={styles.row}>
          <span>Referência</span>
          <strong>{occurrence.reference}</strong>
        </div>
        <div className={styles.row}>
          <span>Criada em</span>
          <strong>{formatDate(occurrence.createdAt)}</strong>
        </div>
      </Card>

      <Card className={styles.resolutionCard}>
        <h2>Resolução comunitária</h2>
        <p>A ocorrência precisa de 3 confirmações diferentes com foto para ser considerada resolvida.</p>
        <div className={styles.progressHeader}>
          <span>{occurrence.resolutionVotesCount} de 3 confirmações</span>
          <strong>{Math.round(progressPercent)}%</strong>
        </div>
        <div className={styles.progressTrack}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <Button to={`/occurrences/${occurrence.id}/resolve`} fullWidth>
          Informar resolução
        </Button>
      </Card>

      <Button to={`/occurrences/${occurrence.id}/report`} variant="ghost" fullWidth>
        Denunciar ocorrência
      </Button>
    </div>
  );
}
