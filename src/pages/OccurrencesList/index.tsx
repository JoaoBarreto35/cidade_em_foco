import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '../../components/layout/PageHeader';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { getOccurrencesFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';
import { occurrenceCategories } from '../../utils/categories';
import type { OccurrenceStatus } from '../../utils/statusLabels';

import styles from './styles.module.css';

const statuses: Array<{ label: string; value: 'all' | OccurrenceStatus }> = [
  { label: 'Todas', value: 'all' },
  { label: 'Abertas', value: 'open' },
  { label: 'Resolvidas', value: 'resolved' },
  { label: 'Revisão', value: 'under_review' },
];

export function OccurrencesList() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [status, setStatus] = useState<'all' | OccurrenceStatus>('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
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

  const filtered = useMemo(
    () =>
      occurrences.filter((occurrence) => {
        const matchesStatus = status === 'all' || occurrence.status === status;
        const matchesCategory = category === 'all' || occurrence.category === category;
        const text = `${occurrence.title} ${occurrence.description} ${occurrence.neighborhood}`.toLowerCase();

        return matchesStatus && matchesCategory && text.includes(search.toLowerCase());
      }),
    [category, occurrences, search, status],
  );

  return (
    <div className="page stack">
      <PageHeader
        eyebrow="Ocorrências"
        title="Registros da comunidade"
        description="Acompanhe os pontos cadastrados, filtre por categoria e veja quais já foram resolvidos."
        action={<Button to="/occurrences/new">Nova ocorrência</Button>}
      />

      <section className={styles.filters}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por bairro, descrição ou título"
        />

        <div className={styles.chips}>
          {statuses.map((item) => (
            <button
              key={item.value}
              className={status === item.value ? styles.active : ''}
              onClick={() => setStatus(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">Todas as categorias</option>
          {occurrenceCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </section>

      {error && <Card><p>{error}</p></Card>}
      {loading && <Card><p>Carregando ocorrências do Supabase...</p></Card>}

      <section className="section">
        {!loading && filtered.length > 0 ? (
          filtered.map((occurrence) => <OccurrenceCard key={occurrence.id} occurrence={occurrence} />)
        ) : null}

        {!loading && filtered.length === 0 && (
          <EmptyState
            title="Nada encontrado"
            description="Tente mudar os filtros ou registre uma nova ocorrência."
            actionLabel="Registrar ocorrência"
            actionTo="/occurrences/new"
          />
        )}
      </section>
    </div>
  );
}
