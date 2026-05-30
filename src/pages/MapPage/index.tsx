import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '../../components/layout/PageHeader';
import { OccurrenceMap } from '../../components/map/OccurrenceMap';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getOccurrencesFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';
import { occurrenceCategories } from '../../utils/categories';
import { buildDashboardMetrics } from '../../utils/dashboardMetrics';
import type { OccurrenceStatus } from '../../utils/statusLabels';

import styles from './styles.module.css';

type StatusFilter = 'all' | OccurrenceStatus;
type CategoryFilter = 'all' | string;
type MapMode = 'pins' | 'heatmap';

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'open', label: 'Abertas' },
  { id: 'resolution_suggested', label: 'Em resolução' },
  { id: 'resolved', label: 'Resolvidas' },
  { id: 'under_review', label: 'Revisão' },
];

function filterOccurrences(
  occurrences: Occurrence[],
  statusFilter: StatusFilter,
  categoryFilter: CategoryFilter,
): Occurrence[] {
  return occurrences.filter((occurrence) => {
    const matchesStatus = statusFilter === 'all' || occurrence.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || occurrence.category === categoryFilter;

    return matchesStatus && matchesCategory;
  });
}

export function MapPage() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [mapMode, setMapMode] = useState<MapMode>('pins');
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
              : 'Não foi possível carregar o mapa com dados do banco.',
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

  const filteredOccurrences = useMemo(
    () => filterOccurrences(occurrences, statusFilter, categoryFilter),
    [occurrences, statusFilter, categoryFilter],
  );

  const metrics = useMemo(() => buildDashboardMetrics(filteredOccurrences), [filteredOccurrences]);

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Mapa"
        title="Mapa da comunidade"
        description="Visualize as ocorrências registradas, alterne entre pins e mapa de calor, e encontre áreas com maior concentração de problemas."
        action={<Button to="/occurrences/new">Registrar</Button>}
      />

      <Card>
        <div className={styles.filtersHeader}>
          <div>
            <strong>Filtros do mapa</strong>
            <span>{loading ? 'Carregando...' : `${filteredOccurrences.length} ponto(s) encontrado(s)`}</span>
          </div>
          <Button to="/occurrences" variant="ghost">
            Ver lista
          </Button>
        </div>

        <div className={styles.modeGroup} aria-label="Modo de visualização do mapa">
          <button
            type="button"
            className={mapMode === 'pins' ? styles.activeMode : styles.modeButton}
            onClick={() => setMapMode('pins')}
          >
            📍 Pins
          </button>
          <button
            type="button"
            className={mapMode === 'heatmap' ? styles.activeMode : styles.modeButton}
            onClick={() => setMapMode('heatmap')}
          >
            🔥 Calor
          </button>
        </div>

        <div className={styles.filterGroup} aria-label="Filtrar por status">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={filter.id === statusFilter ? styles.activeFilter : styles.filterButton}
              onClick={() => setStatusFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup} aria-label="Filtrar por categoria">
          <button
            type="button"
            className={categoryFilter === 'all' ? styles.activeFilter : styles.filterButton}
            onClick={() => setCategoryFilter('all')}
          >
            Todas categorias
          </button>
          {occurrenceCategories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              type="button"
              className={category.id === categoryFilter ? styles.activeFilter : styles.filterButton}
              onClick={() => setCategoryFilter(category.id)}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </Card>

      {error && <Card><p>{error}</p></Card>}
      {loading ? (
        <Card><p>Carregando mapa...</p></Card>
      ) : (
        <OccurrenceMap
          occurrences={filteredOccurrences}
          height="large"
          showHeatmap={mapMode === 'heatmap'}
        />
      )}

      <section className={styles.insightsGrid}>
        <Card className={styles.insightCard}>
          <span>Taxa de resolução</span>
          <strong>{metrics.resolutionRate}%</strong>
          <p>{metrics.resolved} de {metrics.total} ocorrência(s) resolvida(s).</p>
        </Card>
        <Card className={styles.insightCard}>
          <span>Em revisão</span>
          <strong>{metrics.underReview}</strong>
          <p>{metrics.reviewRate}% dos registros filtrados precisam de atenção.</p>
        </Card>
      </section>

      <section className="section">
        <div className={styles.sectionTitleRow}>
          <h2>Pontos críticos</h2>
          <span>Top categorias e bairros do filtro atual.</span>
        </div>

        <div className={styles.metricGrid}>
          <Card>
            <h3>Categorias</h3>
            <div className={styles.barsList}>
              {metrics.byCategory.slice(0, 5).map((item) => (
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
              {metrics.byCategory.length === 0 && <p>Nenhuma categoria no filtro atual.</p>}
            </div>
          </Card>

          <Card>
            <h3>Bairros</h3>
            <div className={styles.barsList}>
              {metrics.byNeighborhood.slice(0, 5).map((item) => (
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
              {metrics.byNeighborhood.length === 0 && <p>Nenhum bairro no filtro atual.</p>}
            </div>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className={styles.sectionTitleRow}>
          <h2>Ocorrências no mapa</h2>
          <span>Toque em um pin para abrir o resumo.</span>
        </div>

        <div className={styles.cardsGrid}>
          {filteredOccurrences.slice(0, 4).map((occurrence) => (
            <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
          ))}
        </div>
      </section>
    </div>
  );
}
