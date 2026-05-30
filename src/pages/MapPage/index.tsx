import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '../../components/layout/PageHeader';
import { OccurrenceMap } from '../../components/map/OccurrenceMap';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getOccurrencesFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';
import { occurrenceCategories } from '../../utils/categories';
import type { OccurrenceStatus } from '../../utils/statusLabels';

import styles from './styles.module.css';

type StatusFilter = 'all' | OccurrenceStatus;
type CategoryFilter = 'all' | string;

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

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Mapa"
        title="Mapa da comunidade"
        description="Visualize as ocorrências registradas com localização real no mapa. Agora os dados são lidos do Supabase."
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
      {loading ? <Card><p>Carregando mapa...</p></Card> : <OccurrenceMap occurrences={filteredOccurrences} height="large" />}

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
