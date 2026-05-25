import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  adminCancelOccurrence,
  adminCancelResolutionVote,
  adminKeepOccurrence,
  adminKeepResolutionVote,
  adminMarkOccurrenceAsDuplicated,
  getOccurrences,
  getResolutionModerationItems,
} from '../../services/occurrencesLocalService';
import { getCategoryById } from '../../utils/categories';
import { formatDate } from '../../utils/formatDate';
import { getStatusInfo } from '../../utils/statusLabels';

import styles from './styles.module.css';

type ModerationTab = 'occurrences' | 'resolutions';

export function AdminModeration() {
  const [tab, setTab] = useState<ModerationTab>('occurrences');
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState('');

  const occurrences = getOccurrences();
  const occurrenceItems = occurrences.filter(
    (item) => item.status === 'under_review' || item.reportsCount >= 3,
  );
  const resolutionItems = getResolutionModerationItems();

  function refresh(nextMessage: string) {
    setMessage(nextMessage);
    setVersion((current) => current + 1);
  }

  function handleKeepOccurrence(occurrenceId: string) {
    const result = adminKeepOccurrence(occurrenceId);
    refresh(result.error ?? 'Ocorrência mantida e retirada da revisão.');
  }

  function handleCancelOccurrence(occurrenceId: string) {
    const result = adminCancelOccurrence(occurrenceId);
    refresh(result.error ?? 'Ocorrência cancelada pela moderação.');
  }

  function handleDuplicateOccurrence(occurrenceId: string) {
    const result = adminMarkOccurrenceAsDuplicated(occurrenceId);
    refresh(result.error ?? 'Ocorrência marcada como duplicada.');
  }

  function handleKeepResolution(occurrenceId: string, resolutionVoteId: string) {
    const result = adminKeepResolutionVote(occurrenceId, resolutionVoteId);
    refresh(result.error ?? 'Resolução mantida e voltou a contar como válida.');
  }

  function handleCancelResolution(occurrenceId: string, resolutionVoteId: string) {
    const result = adminCancelResolutionVote(occurrenceId, resolutionVoteId);
    refresh(result.error ?? 'Resolução cancelada e status da ocorrência recalculado.');
  }

  return (
    <main className={styles.page} data-version={version}>
      <header className={styles.header}>
        <div>
          <span>Moderação</span>
          <h1>Itens em revisão</h1>
        </div>
        <Link to="/admin">Dashboard</Link>
      </header>

      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === 'occurrences' ? styles.activeTab : styles.tab}
          onClick={() => setTab('occurrences')}
        >
          Ocorrências ({occurrenceItems.length})
        </button>
        <button
          type="button"
          className={tab === 'resolutions' ? styles.activeTab : styles.tab}
          onClick={() => setTab('resolutions')}
        >
          Resoluções ({resolutionItems.length})
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {tab === 'occurrences' && (
        <section className="section">
          {occurrenceItems.length > 0 ? (
            occurrenceItems.map((item) => {
              const category = getCategoryById(item.category);
              const status = getStatusInfo(item.status);

              return (
                <Card key={item.id} className={styles.reviewCard}>
                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.eyebrow}>{category.icon} {category.label}</span>
                      <h2>{item.title}</h2>
                    </div>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>

                  <img src={item.photoUrl} alt={item.title} className={styles.image} />

                  <div className={styles.meta}>
                    <span>📍 {item.reference}</span>
                    <span>🏘️ {item.neighborhood}</span>
                    <span>📅 {formatDate(item.createdAt)}</span>
                    <span>🚩 {item.reportsCount} denúncia(s)</span>
                  </div>

                  <p>{item.description}</p>

                  <div className={styles.actions}>
                    <Button type="button" onClick={() => handleKeepOccurrence(item.id)} fullWidth>
                      Manter ocorrência
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDuplicateOccurrence(item.id)}
                      variant="secondary"
                      fullWidth
                    >
                      Marcar duplicada
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCancelOccurrence(item.id)}
                      variant="danger"
                      fullWidth
                    >
                      Cancelar ocorrência
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <EmptyState
              title="Nenhuma ocorrência em revisão"
              description="Ocorrências aparecem aqui quando atingem 3 denúncias."
            />
          )}
        </section>
      )}

      {tab === 'resolutions' && (
        <section className="section">
          {resolutionItems.length > 0 ? (
            resolutionItems.map(({ occurrence, vote }) => (
              <Card key={vote.id} className={styles.reviewCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.eyebrow}>Resolução denunciada</span>
                    <h2>{occurrence.title}</h2>
                  </div>
                  <Badge tone="warning">Em revisão</Badge>
                </div>

                <img src={vote.photoUrl} alt="Foto de resolução denunciada" className={styles.image} />

                <div className={styles.meta}>
                  <span>📅 {formatDate(vote.createdAt)}</span>
                  <span>🚩 {vote.reportsCount} denúncia(s)</span>
                  <span>📍 {occurrence.reference}</span>
                </div>

                <p>{vote.note ?? 'Confirmação de resolução enviada pela comunidade.'}</p>

                <div className={styles.actions}>
                  <Button
                    type="button"
                    onClick={() => handleKeepResolution(occurrence.id, vote.id)}
                    fullWidth
                  >
                    Manter resolução
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleCancelResolution(occurrence.id, vote.id)}
                    variant="danger"
                    fullWidth
                  >
                    Cancelar resolução
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              title="Nenhuma resolução em revisão"
              description="Resoluções aparecem aqui quando atingem 3 denúncias."
            />
          )}
        </section>
      )}
    </main>
  );
}
