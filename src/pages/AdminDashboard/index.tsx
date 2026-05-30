import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { OccurrenceMap } from '../../components/map/OccurrenceMap';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  getOccurrencesFromSupabase,
} from '../../services/supabase/occurrencesSupabaseService';
import { getResolutionModerationItemsFromSupabase } from '../../services/supabase/adminSupabaseService';
import { signOutAdmin } from '../../services/supabase/authSupabaseService';
import type { Occurrence, ResolutionModerationItem } from '../../types/occurrence';
import { buildDashboardMetrics } from '../../utils/dashboardMetrics';

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

  const metrics = useMemo(() => buildDashboardMetrics(occurrences), [occurrences]);

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
          <p>Indicadores, pontos críticos e visão de calor das ocorrências registradas.</p>
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
          <strong>{metrics.total}</strong>
          <span>Total de ocorrências</span>
        </Card>
        <Card>
          <strong>{metrics.resolved}</strong>
          <span>Resolvidas pela comunidade</span>
        </Card>
        <Card>
          <strong>{metrics.underReview}</strong>
          <span>Ocorrências em revisão</span>
        </Card>
        <Card>
          <strong>{resolutionReviewItems.length}</strong>
          <span>Resoluções em revisão</span>
        </Card>
        <Card>
          <strong>{metrics.totalReports}</strong>
          <span>Denúncias registradas</span>
        </Card>
        <Card>
          <strong>{metrics.resolutionRate}%</strong>
          <span>Taxa de resolução</span>
        </Card>
      </section>

      <section className={styles.dashboardGrid}>
        <Card className={styles.mapCard}>
          <div className={styles.cardTitleRow}>
            <div>
              <h2>Mapa de calor</h2>
              <p>Regiões com maior concentração e mais denúncias aparecem com maior intensidade.</p>
            </div>
            <Link to="/map">Abrir mapa</Link>
          </div>
          <OccurrenceMap occurrences={occurrences} height="compact" showHeatmap />
        </Card>

        <Card>
          <div className={styles.cardTitleRow}>
            <div>
              <h2>Resumo por status</h2>
              <p>Distribuição atual das ocorrências.</p>
            </div>
          </div>

          <div className={styles.barsList}>
            {metrics.byStatus.map((item) => (
              <div key={item.id} className={styles.barItem}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className={styles.barTrack}>
                  <span style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
            {!loading && metrics.byStatus.length === 0 && <p>Nenhuma ocorrência registrada.</p>}
          </div>
        </Card>
      </section>

      <section className={styles.dashboardGrid}>
        <Card>
          <div className={styles.cardTitleRow}>
            <div>
              <h2>Categorias críticas</h2>
              <p>Tipos de problema mais registrados pela comunidade.</p>
            </div>
          </div>

          <div className={styles.barsList}>
            {metrics.byCategory.slice(0, 6).map((item) => (
              <div key={item.id} className={styles.barItem}>
                <div>
                  <span>{item.icon} {item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className={styles.barTrack}>
                  <span style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className={styles.cardTitleRow}>
            <div>
              <h2>Bairros com mais registros</h2>
              <p>Ajuda a priorizar áreas para relatório e apresentação.</p>
            </div>
          </div>

          <div className={styles.barsList}>
            {metrics.byNeighborhood.slice(0, 6).map((item) => (
              <div key={item.id} className={styles.barItem}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className={styles.barTrack}>
                  <span style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="section">
        <div className={styles.cardTitleRow}>
          <div>
            <h2>Pendências de moderação</h2>
            <p>Ocorrências denunciadas ou em revisão aparecem primeiro.</p>
          </div>
          <Link className={styles.link} to="/admin/moderation">
            Abrir moderação
          </Link>
        </div>

        <div className={styles.occurrencesGrid}>
          {metrics.criticalOccurrences.length > 0 ? (
            metrics.criticalOccurrences.map((occurrence) => (
              <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
            ))
          ) : (
            <Card><p>Nenhuma pendência crítica no momento.</p></Card>
          )}
        </div>
      </section>
    </main>
  );
}
