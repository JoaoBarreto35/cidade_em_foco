import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getOccurrencesFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';
import { buildDashboardMetrics } from '../../utils/dashboardMetrics';

import styles from './styles.module.css';

export function Home() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadOccurrences(): Promise<void> {
      try {
        const data = await getOccurrencesFromSupabase();

        if (active) {
          setOccurrences(data);
          setError('');
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Não foi possível carregar as ocorrências do banco.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOccurrences();

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => buildDashboardMetrics(occurrences), [occurrences]);

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Atividade extensionista"
        title="Mapeie riscos urbanos da sua comunidade"
        description="Registre focos de dengue, lixo acumulado, esgoto a céu aberto, mato alto e outros problemas com foto e localização."
        action={<Button to="/occurrences/new">Registrar ocorrência</Button>}
      />

      <section className={styles.actions}>
        <Button to="/occurrences/new" fullWidth>
          ➕ Registrar ocorrência
        </Button>
        <Button to="/map" variant="secondary" fullWidth>
          🗺️ Ver mapa e calor
        </Button>
      </section>

      {error && <Card><p>{error}</p></Card>}

      <section className={styles.stats}>
        <Card>
          <strong>{loading ? '...' : metrics.open}</strong>
          <span>Abertas</span>
        </Card>
        <Card>
          <strong>{loading ? '...' : metrics.resolved}</strong>
          <span>Resolvidas</span>
        </Card>
        <Card>
          <strong>{loading ? '...' : metrics.underReview}</strong>
          <span>Em revisão</span>
        </Card>
      </section>

      <section className={styles.insightsGrid}>
        <Card className={styles.heroMetric}>
          <span>Taxa de resolução</span>
          <strong>{loading ? '...' : `${metrics.resolutionRate}%`}</strong>
          <p>Ocorrências resolvidas pela comunidade com fotos de confirmação.</p>
        </Card>
        <Card className={styles.heroMetric}>
          <span>Participação comunitária</span>
          <strong>{loading ? '...' : metrics.totalResolutionVotes}</strong>
          <p>Confirmações de resolução enviadas pelos moradores.</p>
        </Card>
      </section>

      <Card>
        <div className={styles.how}>
          <h2>Como funciona?</h2>
          <ol>
            <li>Moradores registram ocorrências com foto e localização.</li>
            <li>A comunidade acompanha pela lista, pelos pins e pelo mapa de calor.</li>
            <li>Com 3 fotos de resolução, o item é resolvido.</li>
            <li>Denúncias levam casos suspeitos para moderação.</li>
          </ol>
        </div>
      </Card>

      <section className="section">
        <div className={styles.sectionHeader}>
          <h2>Principais indicadores</h2>
          <Link to="/map">Ver mapa</Link>
        </div>

        <div className={styles.metricGrid}>
          <Card>
            <h3>Categorias mais registradas</h3>
            <div className={styles.barsList}>
              {metrics.byCategory.slice(0, 4).map((item) => (
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
              {!loading && metrics.byCategory.length === 0 && <p>Nenhuma ocorrência registrada ainda.</p>}
            </div>
          </Card>

          <Card>
            <h3>Bairros com mais registros</h3>
            <div className={styles.barsList}>
              {metrics.byNeighborhood.slice(0, 4).map((item) => (
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
              {!loading && metrics.byNeighborhood.length === 0 && <p>Nenhum bairro registrado ainda.</p>}
            </div>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className={styles.sectionHeader}>
          <h2>Ocorrências recentes</h2>
          <Link to="/occurrences">Ver todas</Link>
        </div>

        {loading && <Card><p>Carregando ocorrências do Supabase...</p></Card>}

        {!loading && metrics.recentOccurrences.slice(0, 2).map((occurrence) => (
          <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
        ))}
      </section>
    </div>
  );
}
