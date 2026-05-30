import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { OccurrenceMap } from '../../components/map/OccurrenceMap';
import { ResolutionProgress } from '../../components/occurrences/ResolutionProgress';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { getOccurrenceByIdFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence, ResolutionVoteStatus } from '../../types/occurrence';
import { getCategoryById } from '../../utils/categories';
import { formatDate } from '../../utils/formatDate';
import { getStatusInfo } from '../../utils/statusLabels';

import styles from './styles.module.css';

type ResolutionStatusView = {
  label: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};

const resolutionStatus: Record<ResolutionVoteStatus, ResolutionStatusView> = {
  valid: {
    label: 'Válida',
    tone: 'success',
  },
  under_review: {
    label: 'Em revisão',
    tone: 'warning',
  },
  cancelled: {
    label: 'Cancelada',
    tone: 'danger',
  },
};

export function OccurrenceDetails() {
  const { id } = useParams();
  const [occurrence, setOccurrence] = useState<Occurrence | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOccurrence(): Promise<void> {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getOccurrenceByIdFromSupabase(id);

        if (active) {
          setOccurrence(data);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar a ocorrência.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOccurrence();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <Card><p>Carregando ocorrência...</p></Card>;
  }

  if (!occurrence) {
    return (
      <EmptyState
        title="Ocorrência não encontrada"
        description={error || 'O registro solicitado não existe ou foi removido.'}
        actionLabel="Voltar para lista"
        actionTo="/occurrences"
      />
    );
  }

  const category = getCategoryById(occurrence.category);
  const status = getStatusInfo(occurrence.status);

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Detalhe da ocorrência"
        title={occurrence.title}
        description={`${category.icon} ${category.label} • ${occurrence.neighborhood}`}
        action={<Badge tone={status.tone}>{status.label}</Badge>}
      />

      <Card className={styles.photoCard}>
        <img src={occurrence.photoUrl} alt={occurrence.title} />
      </Card>

      <Card>
        <div className={styles.info}>
          <h2>Descrição</h2>
          <p>{occurrence.description}</p>
          <div className={styles.meta}>
            <span>📍 {occurrence.reference}</span>
            <span>🏘️ {occurrence.neighborhood}</span>
            <span>📅 {formatDate(occurrence.createdAt)}</span>
            {occurrence.reportsCount > 0 && <span>🚩 {occurrence.reportsCount} denúncia(s)</span>}
          </div>
        </div>
      </Card>

      <section className="section">
        <h2 className={styles.sectionTitle}>Localização</h2>
        <OccurrenceMap
          occurrences={[occurrence]}
          height="compact"
          selectedOccurrenceId={occurrence.id}
          showPopupLink={false}
        />
      </section>

      <Card>
        <div className={styles.info}>
          <ResolutionProgress votes={occurrence.resolutionVotesCount} />
          <p className={styles.help}>
            A ocorrência só será considerada resolvida após 3 confirmações diferentes com foto obrigatória.
          </p>
          <div className={styles.actions}>
            <Button to={`/occurrences/${occurrence.id}/resolve`} fullWidth>
              Informar resolução
            </Button>
            <Button to={`/occurrences/${occurrence.id}/report`} variant="danger" fullWidth>
              Denunciar ocorrência
            </Button>
          </div>
        </div>
      </Card>

      <section className="section">
        <h2 className={styles.sectionTitle}>Fotos de resolução</h2>
        {occurrence.resolutionVotes.length > 0 ? (
          <div className={styles.resolutionGrid}>
            {occurrence.resolutionVotes.map((vote) => {
              const voteStatus = resolutionStatus[vote.status];

              return (
                <Card key={vote.id} className={styles.resolutionCard}>
                  <img src={vote.photoUrl} alt="Foto de resolução" className={styles.resolutionImage} />
                  <div className={styles.resolutionHeader}>
                    <Badge tone={voteStatus.tone}>{voteStatus.label}</Badge>
                    {vote.reportsCount > 0 && <span>🚩 {vote.reportsCount}</span>}
                  </div>
                  <p>{vote.note ?? 'Confirmação enviada pela comunidade.'}</p>
                  <span>📅 {formatDate(vote.createdAt)}</span>
                  {vote.status !== 'cancelled' && (
                    <Button
                      to={`/occurrences/${occurrence.id}/resolutions/${vote.id}/report`}
                      variant="danger"
                      fullWidth
                    >
                      Denunciar resolução
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Ainda sem fotos"
            description="Quando moradores enviarem confirmações, elas aparecerão aqui."
          />
        )}
      </section>
    </div>
  );
}
