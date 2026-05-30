import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/layout/PageHeader';
import { OccurrenceCard } from '../../components/occurrences/OccurrenceCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getOccurrencesFromSupabase } from '../../services/supabase/occurrencesSupabaseService';
import type { Occurrence } from '../../types/occurrence';

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

  const open = occurrences.filter((occurrence) => occurrence.status === 'open').length;
  const resolved = occurrences.filter((occurrence) => occurrence.status === 'resolved').length;
  const review = occurrences.filter((occurrence) => occurrence.status === 'under_review').length;

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
          🗺️ Ver mapa
        </Button>
      </section>

      {error && <Card><p>{error}</p></Card>}

      <section className={styles.stats}>
        <Card>
          <strong>{loading ? '...' : open}</strong>
          <span>Abertas</span>
        </Card>
        <Card>
          <strong>{loading ? '...' : resolved}</strong>
          <span>Resolvidas</span>
        </Card>
        <Card>
          <strong>{loading ? '...' : review}</strong>
          <span>Em revisão</span>
        </Card>
      </section>

      <Card>
        <div className={styles.how}>
          <h2>Como funciona?</h2>
          <ol>
            <li>Moradores registram ocorrências com foto e localização.</li>
            <li>A comunidade acompanha pela lista e pelo mapa.</li>
            <li>Com 3 fotos de resolução, o item é resolvido.</li>
            <li>Denúncias levam casos suspeitos para moderação.</li>
          </ol>
        </div>
      </Card>

      <section className="section">
        <div className={styles.sectionHeader}>
          <h2>Ocorrências recentes</h2>
          <Link to="/occurrences">Ver todas</Link>
        </div>

        {loading && <Card><p>Carregando ocorrências do Supabase...</p></Card>}

        {!loading && occurrences.slice(0, 2).map((occurrence) => (
          <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
        ))}
      </section>
    </div>
  );
}
