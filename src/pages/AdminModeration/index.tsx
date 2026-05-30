import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  adminCancelOccurrenceInSupabase,
  adminCancelResolutionVoteInSupabase,
  adminKeepOccurrenceInSupabase,
  adminKeepResolutionVoteInSupabase,
  adminMarkOccurrenceAsDuplicatedInSupabase,
  getResolutionModerationItemsFromSupabase,
} from '../../services/supabase/adminSupabaseService';
import { getOccurrencesFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence, ResolutionModerationItem } from '../../types/occurrence';
import { getCategoryById } from '../../utils/categories';
import { formatDate } from '../../utils/formatDate';
import { getStatusInfo } from '../../utils/statusLabels';

import styles from './styles.module.css';

type ModerationTab = 'occurrences' | 'resolutions';

export function AdminModeration() {
  const [tab, setTab] = useState<ModerationTab>('occurrences');
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [resolutionItems, setResolutionItems] = useState<ResolutionModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadModeration(): Promise<void> {
    setLoading(true);

    try {
      const [occurrencesData, resolutionItemsData] = await Promise.all([
        getOccurrencesFromSupabase(),
        getResolutionModerationItemsFromSupabase(),
      ]);

      setOccurrences(occurrencesData);
      setResolutionItems(resolutionItemsData);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar a moderação.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadModeration();
  }, []);

  const occurrenceItems = occurrences.filter(
    (item) => item.status === 'under_review' || item.reportsCount >= 3,
  );

  async function runAction(action: () => Promise<{ success: boolean; error?: string }>, successMessage: string) {
    setMessage('');
    const result = await action();

    if (result.error) {
      setError(result.error);
      return;
    }

    setError('');
    setMessage(successMessage);
    await loadModeration();
  }

  function handleKeepOccurrence(occurrenceId: string) {
    void runAction(
      () => adminKeepOccurrenceInSupabase(occurrenceId),
      'Ocorrência mantida e retirada da revisão.',
    );
  }

  function handleCancelOccurrence(occurrenceId: string) {
    void runAction(
      () => adminCancelOccurrenceInSupabase(occurrenceId),
      'Ocorrência cancelada pela moderação.',
    );
  }

  function handleDuplicateOccurrence(occurrenceId: string) {
    void runAction(
      () => adminMarkOccurrenceAsDuplicatedInSupabase(occurrenceId),
      'Ocorrência marcada como duplicada.',
    );
  }

  function handleKeepResolution(resolutionVoteId: string) {
    void runAction(
      () => adminKeepResolutionVoteInSupabase(resolutionVoteId),
      'Resolução mantida e voltou a contar como válida.',
    );
  }

  function handleCancelResolution(resolutionVoteId: string) {
    void runAction(
      () => adminCancelResolutionVoteInSupabase(resolutionVoteId),
      'Resolução cancelada e status da ocorrência recalculado.',
    );
  }

  return (
    <main className={styles.page}>
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

      {loading && <Card><p>Carregando moderação...</p></Card>}
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.message}>{error}</p>}

      {!loading && tab === 'occurrences' && (
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

      {!loading && tab === 'resolutions' && (
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
                    onClick={() => handleKeepResolution(vote.id)}
                    fullWidth
                  >
                    Manter resolução
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleCancelResolution(vote.id)}
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
