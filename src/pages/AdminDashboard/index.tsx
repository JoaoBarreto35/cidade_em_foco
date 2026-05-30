import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  getOccurrencesFromSupabase,
} from '../../services/supabase/occurrencesSupabaseService';
import { getResolutionModerationItemsFromSupabase } from '../../services/supabase/adminSupabaseService';
import { signOutAdmin } from '../../services/supabase/authSupabaseService';
import type { Occurrence, ResolutionModerationItem } from '../../types/occurrence';

import styles from './styles.module.css';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [resolutionReviewItems, setResolutionReviewItems] = useState<ResolutionModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard(): Promise<void> {
      try {
        const [occurrencesData, resolutionItemsData] = await Promise.all([
          getOccurrencesFromSupabase(),
          getResolutionModerationItemsFromSupabase(),
        ]);

        if (active) {
          setOccurrences(occurrencesData);
          setResolutionReviewItems(resolutionItemsData);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar o dashboard.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const occurrenceReview = occurrences.filter(
    (occurrence) => occurrence.status === 'under_review' || occurrence.reportsCount >= 3,
  ).length;
  const totalReports = occurrences.reduce(
    (total, occurrence) =>
      total +
      occurrence.reportsCount +
      occurrence.resolutionVotes.reduce((voteTotal, vote) => voteTotal + vote.reportsCount, 0),
    0,
  );
  const resolved = occurrences.filter((occurrence) => occurrence.status === 'resolved').length;

  async function handleLogout(): Promise<void> {
    await signOutAdmin();
    navigate('/admin/login', { replace: true });
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span>Admin</span>
          <h1>Dashboard</h1>
        </div>
        <div className={styles.headerActions}>
          <Link to="/">Ver app</Link>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {error && <Card><p>{error}</p></Card>}
      {loading && <Card><p>Carregando dados do Supabase...</p></Card>}

      <section className={styles.grid}>
        <Card>
          <strong>{occurrences.length}</strong>
          <span>Total de ocorrências</span>
        </Card>
        <Card>
          <strong>{resolved}</strong>
          <span>Resolvidas pela comunidade</span>
        </Card>
        <Card>
          <strong>{occurrenceReview}</strong>
          <span>Ocorrências em revisão</span>
        </Card>
        <Card>
          <strong>{resolutionReviewItems.length}</strong>
          <span>Resoluções em revisão</span>
        </Card>
        <Card>
          <strong>{totalReports}</strong>
          <span>Denúncias registradas</span>
        </Card>
      </section>

      <Link className={styles.link} to="/admin/moderation">
        Abrir moderação
      </Link>
    </main>
  );
}
